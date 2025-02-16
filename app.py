from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/lyrics_db")
client = MongoClient(mongo_uri)
db = client["lyrics_db"]
collection = db["songs"]

@app.route("/")
def home():
    return jsonify({"message": "Flask with MongoDB is running!"})

@app.route("/add_song", methods=["POST"])
def add_song():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    insert_result = collection.insert_one(data)
    return jsonify({"message": "Song added!", "id": str(insert_result.inserted_id)})

@app.route("/random_lyric", methods=["GET"])
def get_random_lyric():
    """MongoDB からランダムな1曲を取得し、その曲の情報を全て返す"""
    pipeline = [
        {"$sample": {"size": 1}}  # 1曲ランダムに取得
    ]
    result = list(collection.aggregate(pipeline))

    if not result:
        return jsonify({"error": "No songs found"}), 404

    song = result[0]  # ランダムに取得した1曲
    song["_id"] = str(song["_id"])  # `_id` を文字列に変換

    return jsonify(song)


@app.route("/all_songs", methods=["GET"])
def get_all_songs():
    """MongoDB に登録されている全ての曲情報を取得"""
    songs = list(collection.find())
    for song in songs:
        song["_id"] = str(song["_id"])
    return jsonify(songs)

@app.route("/refresh_db", methods=["POST"])
def refresh_db():
    """MongoDB のデータを全削除し、データベースをリフレッシュ"""
    collection.delete_many({})  # すべてのデータを削除
    return jsonify({"message": "Database has been refreshed!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5555, debug=True)
