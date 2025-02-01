from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/timer')
def timer():
    reward_type = request.args.get('reward_type', default='animals')  # Default to animals
    return render_template('timer.html', reward_type=reward_type)

@app.route('/active-timer')
def active_timer():
    learning_time = request.args.get('learning', default=30, type=int)
    break_time = request.args.get('break_time', default=5, type=int)
    reward_type = request.args.get('reward_type', default='animals')  # Pass reward_type
    return render_template('active-timer.html', learning=learning_time, break_time=break_time, reward_type=reward_type)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)