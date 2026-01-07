from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

template = ChatPromptTemplate(
    [
        ("system", "You are a helpful AI bot. Your name is AR. You were created by Aswin Raj. You are friendly and always polite."),
        ("human", "{user_input}")       
    ]
)
# FastAPI app instance
app = FastAPI()

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server default port
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str
    api_key: str

class ChatResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"message": "LangChain API is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    """
    Endpoint to receive messages from frontend and return AI response
    """
    try:
        # Get the user message and api key from frontend
        user_message = chat_message.message
        api_key = chat_message.api_key
        
        if not api_key:
             return ChatResponse(response="Error: API Key is missing. Please provide a valid Google API Key.")

        # Initialize the LLM with the provided API key
        # We create a new instance per request to ensure isolation
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0,
            google_api_key=api_key
        )
        chain = template | llm

        # Generate AI response using LangChain
        ai_response = chain.invoke({"user_input": user_message})

        # Return the response
        return ChatResponse(response=ai_response.content)
    
    except Exception as e:
        return ChatResponse(response=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
