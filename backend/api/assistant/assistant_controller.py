#Import Db Instance from firebase_config
from flask import request, jsonify, Blueprint

import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from api.assistant.assistant_service import AssistantService


# Initialiaze a Blueprint for habits
assistant_bp = Blueprint('assistant', __name__, url_prefix='/api/chatbot')


# Instanciate Gemini Assistant Service
assistant_service = AssistantService()


#Return Chat Response for given user ID and Habit ID
@assistant_bp.route('/get', methods=['POST'])
def get_assistant_answer():
    request_data = request.json
    if not request_data or "user_id" not in request_data or "habit_id" not in request_data:
        return jsonify({"success": "false", "error": "Invalid Request, missing arguments"}), 400

    try:
        result = assistant_service.chat(data=request_data)
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    print("I'm a controller")