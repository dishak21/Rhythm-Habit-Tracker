
from flask import Flask
from flask_cors import CORS
# from api.routes import category_routes, assistant_routes
from api.habits import habit_controller
from api.assistant import assistant_controller

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Use the specific origin if needed    

# Register Controllers
app.register_blueprint(habit_controller.habits_bp)
app.register_blueprint(assistant_controller.assistant_bp)



if __name__ == '__main__':
    app.run(debug=True)
