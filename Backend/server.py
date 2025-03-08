from flask import Flask, request, jsonify
from google import genai
import google.generativeai as ai_gen
import os
import json
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()
client = genai.Client(api_key=os.getenv("API_KEY"))
ai_gen.configure(api_key=os.getenv("API_KEY"))

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['GET'])
def connect():
    """Health check endpoint"""
    print('Connected to the server')
    return jsonify({"status": "Connected to the server"})


@app.route('/generatePS', methods=['GET'])
def generatePS():
    """Generate a beginner-level Solidity problem statement"""
    prompt = """You are a senior blockchain developer creating educational content for Solidity beginners.

    Generate a beginner-friendly smart contract problem statement that helps someone new to Solidity learn fundamental concepts.
    
    The problem should:
    - Focus on basic contract structure, simple data types, functions, and state variables
    - Be approachable for someone with programming experience but new to blockchain
    - Include a real-world use case that demonstrates the value of smart contracts
    - Be implementable in 30-50 lines of code
    
    Format the problem statement as a JSON object with these fields:
    {
        "title": "A concise, descriptive title",
        "description": "A detailed explanation of the problem context and objectives",
        "requirements": ["List of specific technical requirements the solution must meet"],
        "hints": ["Helpful guidance without giving away the solution"]
    }
    
    Do not include code solutions in your response, only the problem statement.
    """
    
    return generate_problem_statement(prompt)


@app.route('/generatePSI', methods=['GET'])
def generatePSI():
    """Generate an intermediate-level Solidity problem statement"""
    prompt = """You are a senior blockchain developer creating educational content for intermediate Solidity developers.

    Generate an intermediate-level smart contract problem statement that helps developers advance their Solidity skills.
    
    The problem should:
    - Focus on more complex concepts like inheritance, libraries, events, modifiers, and error handling
    - Include interaction between multiple contracts or interfaces
    - Present a realistic DeFi, NFT, or DAO use case that requires thoughtful implementation
    - Encourage gas optimization and security best practices
    
    Format the problem statement as a JSON object with these fields:
    {
        "title": "A concise, descriptive title",
        "description": "A detailed explanation of the problem context and objectives",
        "requirements": ["List of specific technical requirements the solution must meet"],
        "hints": ["Helpful guidance without giving away the solution"]
    }
    
    Do not include code solutions in your response, only the problem statement.
    """
    
    return generate_problem_statement(prompt)


@app.route('/generatePSA', methods=['GET'])
def generatePSA():
    """Generate an advanced-level Solidity problem statement"""
    prompt = """You are a senior blockchain developer creating educational content for advanced Solidity developers.

    Generate an advanced smart contract problem statement that challenges experienced Solidity developers.
    
    The problem should:
    - Focus on complex topics like proxy patterns, factory contracts, and advanced gas optimization
    - Include security considerations for high-value contracts
    - Require implementation of EIPs or standards (like ERC20, ERC721, ERC1155, etc.)
    - Present a complex real-world scenario that would benefit from blockchain technology
    - Challenge developers to handle edge cases and potential vulnerabilities
    
    Format the problem statement as a JSON object with these fields:
    {
        "title": "A concise, descriptive title",
        "description": "A detailed explanation of the problem context and objectives",
        "requirements": ["List of specific technical requirements the solution must meet"],
        "hints": ["Helpful guidance without giving away the solution"]
    }
    
    Do not include code solutions in your response, only the problem statement.
    """
    
    return generate_problem_statement(prompt)


def generate_problem_statement(prompt):
    """Helper function to generate problem statements"""
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        
        text_response = response.candidates[0].content.parts[0].text
        
        # Clean up the response to extract only the JSON part
        if '```json' in text_response:
            # Extract text between ```json and the next ```
            start_index = text_response.find('```json') + 7
            end_index = text_response.find('```', start_index)
            if end_index != -1:
                text_response = text_response[start_index:end_index].strip()
            else:
                # If no ending ``` is found, just remove the start
                text_response = text_response[start_index:].strip()
        
        # Parse the JSON
        json_response = json.loads(text_response)
        return jsonify(json_response)
    except Exception as e:
        print(f"Error processing response: {str(e)}")
        text_response = "Error occurred during response processing"
        print(f"Raw response text: {text_response}")
        # Return both the error and the text for debugging
        return jsonify({
            'error': str(e),
            'raw_text': text_response
        }), 500


@app.route('/validate-code', methods=['POST'])
def validate_code():
    """Validate Solidity code against a problem statement"""
    data = request.get_json()
    problem_statement = data.get('problem_statement', '')
    code = data.get('code', '')
    
    prompt = """You are a Solidity compiler and code validator. Analyze the provided Solidity code against the problem statement.

    Your task is to validate:
    
    1. SYNTAX: Verify all keywords match Solidity syntax specification
    2. STRUCTURE: Confirm proper placement of brackets, parentheses, braces, and semicolons
    3. COMPILATION: Determine if the code would compile successfully
    4. LANGUAGE: Verify the code is written in Solidity
    
    
    Respond with a JSON object containing:
    {
        "status": true/false (overall assessment of the code's validity),
        "syntax_correct": true/false (assessment of syntax correctness),
        "compilable_code": true/false (assessment of compilation success),
        "error": "Detailed error message if any issues found, otherwise empty string",
    }
    
    Base your assessment ONLY on standard Solidity compilation rules and the problem requirements. If you can't determine some aspect with certainty, err on the side of caution and flag potential issues.
    """
    
    return process_code_analysis(problem_statement, code, prompt)


@app.route('/suggestions', methods=['POST'])
def suggestions():
    """Provide suggestions to improve Solidity code"""
    data = request.get_json()
    problem_statement = data.get('problem_statement', '')
    code = data.get('code', '')
    
    prompt = """You are an expert Solidity mentor with years of experience in blockchain development and smart contract auditing.

    Review the Solidity code against the problem statement and provide structured feedback in JSON format with the values being simple short strings:

{
    "errors": "List of syntax errors or issues that prevent compilation",
    "improvements": "Improvements to optimize gas usage, enhance security, or follow best practices",
    "compliments": "Compliments for well-written code or good practices",
    "summary": "Overall assessment and key points"
}

Guidelines:
1. **Be Specific** - Point to exact lines or functions needing attention.
2. **Be Educational** - Explain why a change is needed, not just what to change.
3. **Be Constructive** - Phrase feedback positively to encourage learning.
4. **Be Comprehensive** - Cover syntax, security, gas optimization, and best practices.

If the code is excellent, acknowledge it while suggesting optimizations.
"""
    
    return process_code_analysis(problem_statement, code, prompt)


def process_code_analysis(problem_statement, code, prompt):
    """Helper function to analyze code with different prompts"""
    try:
        full_prompt = f"PROBLEM STATEMENT:\n{problem_statement}\n\nCODE:\n{code}\n\nINSTRUCTIONS:\n{prompt}"
        
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=full_prompt
        )
        
        text_response = response.candidates[0].content.parts[0].text
        
        # Clean up the response to extract only the JSON part
        if '```json' in text_response:
            # Extract text between ```json and the next ```
            start_index = text_response.find('```json') + 7
            end_index = text_response.find('```', start_index)
            if end_index != -1:
                text_response = text_response[start_index:end_index].strip()
            else:
                # If no ending ``` is found, just remove the start
                text_response = text_response[start_index:].strip()
        
        # Parse the JSON
        json_response = json.loads(text_response)
        return jsonify(json_response)
    except Exception as e:
        print(f"Error processing response: {str(e)}")
        text_response = "Error occurred during code analysis"
        print(f"Raw response text: {text_response}")
        # Return both the error and the text for debugging
        return jsonify({
            'error': str(e),
            'raw_text': text_response
        }), 500





@app.route("/chat", methods=["POST"])
def chat():
    
    system_instruction = """You are a blockchain expert chatbot. 
You provide detailed and accurate answers to the specific question. At the end of each response, ask the user if they want to know more about any related topics and give some examples. 
If a question is outside of blockchain topics, politely guide the user back to blockchain-related discussions."""
    model = ai_gen.GenerativeModel("gemini-2.0-flash")
    try:
        data = request.json
        user_input = data.get('message', '')
        
        if not user_input:
            return jsonify({'error': 'No message provided'}), 400
        
        response = model.generate_content(f"{system_instruction}\n\nUser: {user_input}\nChatbot:")
        
        return jsonify({'response': response.text})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Failed to generate response'}), 500





if __name__ == '__main__':
    app.run(port=5000, debug=True)