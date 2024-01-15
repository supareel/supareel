CREATE PROJECT IF NOT EXISTS supareel
SHOW MODELS FROM supareel

CREATE DATABASE supareel_db
WITH ENGINE = 'youtube',
PARAMETERS = {
  "youtube_api_token": "AIzaSyAW5Reha8Wz_EMDuRiiuKhPCzyztpbA-LM"  
};

DROP MODEL IF EXISTS supareel.sentiment_classifier;

CREATE MODEL supareel.sentiment_classifier
PREDICT sentiment
USING engine='huggingface',
  model_name= 'cardiffnlp/twitter-roberta-base-sentiment',
  input_column = 'comment',
  labels=['negative','neutral','positive'];



SELECT * FROM supareel_db.comments WHERE video_id = "g-k8qdXpwrQ";
SELECT * FROM supareel_db.channels where channel_id="UCdOb1Se6eXYpYHD8HWFXtWg";

SELECT title, channel_id FROM supareel_db.videos WHERE channel_id='UCdOb1Se6eXYpYHD8HWFXtWg';

DESCRIBE supareel.sentiment_classifier
SEL supareel_db.comments

CREATE VIEW IF NOT EXISTS supareel.comment_predictions AS (
    SELECT input.comment, input.video_id, model.sentiment
    FROM supareel_db.comments AS input 
    JOIN sentiment_classifier AS model ON input.video_id = model.video_id;
);