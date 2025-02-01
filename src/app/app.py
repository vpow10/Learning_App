from flask import Flask, render_template
import requests

app = Flask(__name__)

def get_splash_art(champion, skin_number):
    return f"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/{champion}_{skin_number}.jpg"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/splash/<champion>/<int:skin_number>')
def splash(champion, skin_number):
    splash_url = get_splash_art(champion, skin_number)
    return render_template('splash.html', splash_url=splash_url)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)