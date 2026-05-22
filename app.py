from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def chatbot_response(user_input):
    user_input = user_input.lower()

    if any(word in user_input for word in ["accident", "crash", "takkar", "दुर्घटना"]):
        return "🚨 Accident detected! Click 'Get Help Near Me' and call ambulance immediately."

    elif any(word in user_input for word in ["injury", "hurt", "चोट"]):
        return "⚠️ Someone is injured. Do not move them. Call ambulance."

    elif any(word in user_input for word in ["bleeding", "खून"]):
        return "🩸 Apply pressure to stop bleeding and seek medical help."

    elif any(word in user_input for word in ["unconscious", "बेहोश"]):
        return "⚠️ Check breathing and call ambulance immediately."

    elif "ambulance" in user_input:
        return "🚑 Click the ambulance button to call emergency service (102)."

    elif "help" in user_input or "मदद" in user_input:
        return "🤖 I can help in accidents, injuries, and emergencies."

    else:
        return "Please describe emergency (accident / injury / help)."

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data["message"]
    response = chatbot_response(user_message)
    return jsonify({"response": response})

@app.route("/send_alert", methods=["POST"])
def send_alert():
    data = request.json
    location = data["location"]
    print("🚨 ALERT SENT:", location)
    return jsonify({"status": "Alert sent!"})

if __name__ == "__main__":
    app.run(debug=True)