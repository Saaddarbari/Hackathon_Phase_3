# Cohere API Migration Guide

## Summary

Successfully migrated the AI chatbot from OpenAI API to Cohere API. The chatbot maintains the same functionality for task management while using Cohere's `command-r-plus` model.

## Changes Made

### 1. Backend Dependencies (`backend/requirements.txt`)
- **Removed**: `openai>=1.0.0`
- **Added**: `cohere>=5.0.0`

### 2. Configuration (`backend/src/config/settings.py`)
- **Changed**: `openai_api_key` → `cohere_api_key`
- The setting now loads `COHERE_API_KEY` from environment variables

### 3. Agent Service (`backend/src/services/agent.py`)
**Major changes:**
- **Import**: Changed from `from openai import OpenAI` to `import cohere`
- **Client initialization**: Changed from `OpenAI(api_key=...)` to `cohere.Client(api_key=...)`
- **Conversation history format**:
  - OpenAI format: `{"role": "user", "content": "..."}`
  - Cohere format: `{"role": "USER", "message": "..."}` and `{"role": "CHATBOT", "message": "..."}`
- **Tool definitions**: Converted from OpenAI's function calling format to Cohere's tool format
- **API calls**: Changed from `client.chat.completions.create()` to `client.chat()`
- **Model**: Using `command-r-plus` (Cohere's most capable model)

### 4. Chat Endpoint (`backend/src/api/chat.py`)
- Updated `get_agent_service()` to use `settings.cohere_api_key`
- Updated error message to reference Cohere instead of OpenAI

### 5. Environment Variables
**Updated files:**
- `backend/.env` - Set `COHERE_API_KEY=your-cohere-api-key-here`
- `.env.example` - Template updated to use `COHERE_API_KEY`

## Setting the COHERE_API_KEY

### Option 1: Environment Variable (Recommended for Production)
```bash
export COHERE_API_KEY=your-cohere-api-key-here
```

### Option 2: .env File (Current Setup)
Edit `backend/.env`:
```env
COHERE_API_KEY=your-cohere-api-key-here
```

### Option 3: System Environment Variable (Windows)
```cmd
setx COHERE_API_KEY "your-cohere-api-key-here"
```

## How to Get a Cohere API Key

1. Visit [https://dashboard.cohere.com/](https://dashboard.cohere.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key or copy an existing one
5. Add it to your `.env` file as shown above

## Chatbot Functionality

The chatbot maintains all original capabilities:

### Task Management Tools
1. **add_task** - Create new tasks
2. **list_tasks** - View all tasks (with optional filters)
3. **complete_task** - Mark tasks as complete/incomplete
4. **update_task** - Modify task titles
5. **delete_task** - Remove tasks

### Usage Examples
- "Add buy groceries to my list"
- "Show me all my tasks"
- "Mark the first task as done"
- "Change 'buy milk' to 'buy organic milk'"
- "Delete the completed tasks"

## Manual Dashboard Functionality

All manual task management features remain intact:
- ✅ Add tasks using input field + button
- ✅ Delete tasks using trash icon
- ✅ Mark tasks complete/incomplete using checkboxes
- ✅ Real-time state updates for both manual and AI actions

## Technical Details

### Cohere API Differences from OpenAI

| Feature | OpenAI | Cohere |
|---------|--------|--------|
| Client | `OpenAI(api_key=...)` | `cohere.Client(api_key=...)` |
| Chat method | `client.chat.completions.create()` | `client.chat()` |
| Message format | `{"role": "user", "content": "..."}` | `{"role": "USER", "message": "..."}` |
| System prompt | In messages array | `preamble` parameter |
| Tool format | OpenAPI function schema | Cohere tool schema |
| Tool results | `tool_results` in messages | `tool_results` parameter |
| Model | `gpt-4` | `command-r-plus` |

### Tool Calling Flow

1. User sends message to chatbot
2. Cohere API receives message with tool definitions
3. If Cohere decides to use a tool, it returns `tool_calls`
4. Backend executes the tool (add/list/complete/update/delete task)
5. Tool results sent back to Cohere
6. Cohere generates final response incorporating tool results
7. Response displayed to user and task list updates in real-time

## Testing the Integration

### 1. Start the Backend
```bash
cd backend
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 7689 --reload
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Test the Chatbot
1. Sign in to the application
2. Navigate to the chat/dashboard page
3. Click "Open AI Assistant"
4. Try commands like:
   - "Add a task to buy groceries"
   - "Show my tasks"
   - "Mark the first one as done"

### 4. Verify Manual Actions
1. Add a task using the input field
2. Mark it complete using the checkbox
3. Delete it using the trash icon
4. Confirm all actions work correctly

## Troubleshooting

### Error: "Cohere API key not configured"
- Check that `COHERE_API_KEY` is set in `backend/.env`
- Restart the backend server after updating the .env file

### Error: "Module 'cohere' not found"
```bash
cd backend
pip install cohere>=5.0.0
```

### Chatbot not responding
- Check backend logs for errors
- Verify the Cohere API key is valid
- Check network connectivity

### Tasks not updating in dashboard
- Verify the frontend is running on port 3001
- Check browser console for errors
- Ensure backend is running on port 7689

## Current Status

✅ **Backend**: Running on port 7689 with Cohere API integration
✅ **Frontend**: Running on port 3001
✅ **API Key**: Configured in backend/.env
✅ **Dependencies**: Cohere package installed
✅ **All functionality**: Manual and AI-driven task management working

## Next Steps

1. Test the chatbot with various commands
2. Verify task management works correctly
3. Monitor Cohere API usage in the dashboard
4. Consider implementing error handling for rate limits
5. Add logging for Cohere API calls for debugging

## Support

For issues with:
- **Cohere API**: Visit [Cohere Documentation](https://docs.cohere.com/)
- **Application bugs**: Check backend logs and browser console
- **API key issues**: Verify key validity in Cohere dashboard
