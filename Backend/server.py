import os
import json
import solcx
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import google.generativeai as genai

# Modify this section for better serverless support
# Load environment variables first
load_dotenv()

# Configure solcx - ensure paths are absolute
SOLCX_PATH = os.path.join(os.getcwd(), ".solcx")
os.environ["SOLCX_BINARY_PATH"] = SOLCX_PATH

# Configure API
API_KEY = os.getenv("API_KEY")
if not API_KEY:
    print("Warning: API_KEY not found in environment variables")
    
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['GET'])
def connect():
    """Health check endpoint"""
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
    
    return generate_ai_response(prompt)

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
    
    return generate_ai_response(prompt)

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
    
    return generate_ai_response(prompt)

@app.route('/validate-code', methods=['POST'])
def validate_code():
    """Validate if Solidity code is compilable"""
    data = request.get_json()
    code = data.get('code', '')
    
    # Perform actual compilation check
    compilation_result = check_solidity_compilation(code)
    
    # Return just the compilation result
    return jsonify(compilation_result)

def check_solidity_compilation(code):
    try:
        # Extract pragma version from the code if present
        pragma_version = None
        if "pragma solidity" in code:
            # Find the pragma line
            pragma_line = [line for line in code.split('\n') if "pragma solidity" in line][0]
            
            # Extract version specification - simplified for demo
            pragma_version = "0.8.0"  # Default to 0.8.0 for simplicity
            
            # You may want to parse the pragma more carefully here
            
        # Default to 0.8.0 if no version found
        if not pragma_version:
            pragma_version = "0.8.0"
            code = "pragma solidity ^0.8.0;\n" + code
            
        # Set the compiler version - no installation
        solcx.set_solc_version_pragma(f"^{pragma_version}")
            
        # Compile the code
        output = solcx.compile_source(code)
        
        # Check if compilation was successful by verifying output format
        # The output should contain at least one contract with 'bin' field
        contract_found = False
        for key in output.keys():
            if 'bin' in output[key]:
                contract_found = True
                break
                
        if contract_found:
            return {
                "status": True,
                "syntax_correct": True,
                "compilable_code": True,
                "error": "",
                "solidity_version": pragma_version
            }
        else:
            return {
                "status": False,
                "syntax_correct": True,
                "compilable_code": False,
                "error": "Compilation output is missing bytecode. Check contract structure.",
                "solidity_version": pragma_version
            }
    except Exception as e:
        return {
            "status": False,
            "syntax_correct": False,
            "compilable_code": False,
            "error": str(e),
            "solidity_version": pragma_version if 'pragma_version' in locals() else "unknown"
        }

@app.route('/suggestions', methods=['POST'])
def suggestions():
    """Provide suggestions to improve Solidity code"""
    data = request.get_json()
    problem_statement = data.get('problem_statement', '')
    code = data.get('code', '')
    
    prompt = f"""You are an expert Solidity mentor with years of experience in blockchain development and smart contract auditing.

    PROBLEM STATEMENT:
    {problem_statement}
    
    CODE:
    {code}
    
    Review the Solidity code against the problem statement and provide structured feedback in JSON format with the values being simple short strings:

    {{
        "errors": "List of syntax errors or issues that prevent compilation",
        "improvements": "Improvements to optimize gas usage, enhance security, or follow best practices",
        "compliments": "Compliments for well-written code or good practices",
        "summary": "Overall assessment and key points"
    }}

    Guidelines:
    1. **Be Specific** - Point to exact lines or functions needing attention.
    2. **Be Educational** - Explain why a change is needed, not just what to change.
    3. **Be Constructive** - Phrase feedback positively to encourage learning.
    4. **Be Comprehensive** - Cover syntax, security, gas optimization, and best practices.

    If the code is excellent, acknowledge it while suggesting optimizations.
    """
    
    return generate_ai_response(prompt)

@app.route("/chat", methods=["POST"])
def chat():
    """Chat with a blockchain expert AI"""
    data = request.json
    user_input = data.get('message', '')
    
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400
    
    system_instruction = """You are a blockchain expert chatbot. 
    You provide detailed and accurate answers to the specific question. At the end of each response, ask the user if they want to know more about any related topics and give some examples. 
    If a question is outside of blockchain topics, politely guide the user back to blockchain-related discussions."""
    
    prompt = f"{system_instruction}\n\nUser: {user_input}\nChatbot:"
    
    try:
        response = model.generate_content(prompt)
        return jsonify({'response': response.text})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Failed to generate response'}), 500

def generate_ai_response(prompt):
    """Generate AI responses and return as jsonify response"""
    try:
        response = model.generate_content(prompt)
        text_response = response.text
        
        # Clean up the response to extract only the JSON part if present
        if '```json' in text_response:
            # Extract text between ```json and the next ```
            start_index = text_response.find('```json') + 7
            end_index = text_response.find('```', start_index)
            if end_index != -1:
                text_response = text_response[start_index:end_index].strip()
            else:
                # If no ending ``` is found, just remove the start
                text_response = text_response[start_index:].strip()
        
        # Try to parse the response as JSON
        try:
            json_response = json.loads(text_response)
            return jsonify(json_response)
        except json.JSONDecodeError:
            # If JSON parsing fails, return text as is
            return jsonify({'response': text_response})
            
    except Exception as e:
        print(f"Error processing response: {str(e)}")
        return jsonify({
            'error': str(e),
            'raw_text': text_response if 'text_response' in locals() else "No response generated"
        }), 500

def generate_ai_response_as_dict(prompt):
    """Generate AI responses and return as Python dictionary"""
    try:
        response = model.generate_content(prompt)
        text_response = response.text
        
        # Clean up the response to extract only the JSON part if present
        if '```json' in text_response:
            # Extract text between ```json and the next ```
            start_index = text_response.find('```json') + 7
            end_index = text_response.find('```', start_index)
            if end_index != -1:
                text_response = text_response[start_index:end_index].strip()
            else:
                # If no ending ``` is found, just remove the start
                text_response = text_response[start_index:].strip()
        
        # Try to parse the response as JSON
        try:
            return json.loads(text_response)
        except json.JSONDecodeError:
            # If JSON parsing fails, return a default dictionary
            return {"status": False, "error": "Failed to parse AI response"}
            
    except Exception as e:
        print(f"Error processing response: {str(e)}")
        return {"status": False, "error": f"AI processing error: {str(e)}"}

if __name__ == '__main__':
    app.run(port=5000, debug=True)