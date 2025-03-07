import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("API_KEY")

genai.configure(api_key=API_KEY)

system_instruction = """You are a blockchain expert chatbot. 
You provide detailed and accurate answers to the specific question. At the end of each response, ask the user if they want to know more about any related topics and give some examples. 
If a question is outside of blockchain topics, politely guide the user back to blockchain-related discussions."""

model = genai.GenerativeModel("gemini-2.0-flash")

while True:
    user_input = input("\nUser: ")
    if user_input.lower() in ["exit", "quit", "bye"]:
        print("Chatbot: Goodbye! Happy to discuss blockchain anytime! 🚀")
        break

    response = model.generate_content(f"{system_instruction}\n\nUser: {user_input}\nChatbot:")
    
    print("\nChatbot:", response.text)
