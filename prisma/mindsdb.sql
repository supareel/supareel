CREATE MODEL sentiment_classifier_model
PREDICT sentiment
USING engine='huggingface',
  model_name= 'cardiffnlp/twitter-roberta-base-sentiment',
  input_column = 'comment',
  labels=['negative','neutral','positive'];


-- 
CREATE DATABASE supareel_db
WITH ENGINE = 'youtube',
PARAMETERS = {
  "youtube_api_token": "<your_youtube_api_key>"
};

SELECT * FROM supareel.jobs_history ORDER BY RUN_START DESC;

-- [ONCE] JOB for Syncing youtube videos - 1week
CREATE JOB IF NOT EXISTS supareel.sync_videos AS (
  INSERT INTO planetscale_datasource.YouTubeVideo (
    SELECT 
    video_id as yt_video_id, 
    channel_id as yt_channel_id, 
    title AS yt_video_title, 
    description as yt_video_description, 
    thumbnail as yt_video_thumbnail  
    FROM supareel_db.videos 
    WHERE channel_id = (SELECT yt_channel_id FROM planetscale_datasource.YouTubeChannelDetails)
  )
) END '2024-02-02 00:00:00' EVERY week;

-- JOB for Syncing youtube channel data - 1month
CREATE JOB IF NOT EXISTS supareel.sync_channel_UCdOb1Se6eXYpYHD8HWFXtWg AS (
  UPDATE planetscale_datasource.YouTubeChannelDetails
  SET 
    yt_channel_title=source.title
    subscriber_count=source.subscriber_count
    video_count=source.video_count
    view_count=source.view_count
  FROM (
    SELECT 
    title,
    subscriber_count,
    video_count,
    view_count
    FROM supareel_db.channels WHERE channel_id='UCdOb1Se6eXYpYHD8HWFXtWg'
  ) AS source
  WHERE channel_id='UCdOb1Se6eXYpYHD8HWFXtWg'
) END '2024-02-02 00:00:00' EVERY month;


-- get all comments for video
CREATE JOB IF NOT EXISTS supareel.sync_comments AS (
  DELETE FROM planetscale_datasource.YouTubeComments WHERE yt_video_id IN (SELECT yt_video_id FROM planetscale_datasource.YouTubeVideo);
    INSERT INTO planetscale_datasource.YouTubeComments(
      SELECT
        tc.comment_id AS yt_comment_id,
        tc.video_id AS yt_video_id,
        tc.comment AS yt_comment,
        tc.channel_id AS yt_channel_id
      FROM planetscale_datasource.TestComments tc
      LEFT JOIN planetscale_datasource.YouTubeComments yc ON tc.comment_id = yc.yt_comment_id
      WHERE yc.yt_comment_id IS NULL AND tc.channel_id='UCdOb1Se6eXYpYHD8HWFXtWg'
    );
) END '2024-02-01 00:00:00' EVERY hour;

-- TRIGGER
-- do sentiment analysis
CREATE TRIGGER sentiment_analyse_new_comments
ON planetscale_datasource.YouTubeComments
[COLUMNS yt_comment, sentiment]
(
  UPDATE planetscale_datasource.YouTubeComments
  SET
    sentiment = source.sentiment
  FROM
    (
      SELECT yc.yt_comment, model.sentiment 
      FROM (SELECT yt_comment, yt_video_id AS comment FROM planetscale_datasource.YouTubeComments WHERE yt_video_id IN (
        SELECT yt_video_id FROM planetscale_datasource.YouTubeVideo
      ) AND sentiment='') AS yc
      JOIN supareel.sentiment_classifier AS model 
      ON yc.yt_video_id = model.video_id
    ) AS source
  WHERE source.yt_comment=yt_comment;
) 













DELETE FROM planetscale_datasource.YouTubeComments where yt_comment='Is there any place where we can have a conversation?';

DROP JOB supareel.sync_videos_UCdOb1Se6eXYpYHD8HWFXtWg;
DROP JOB supareel.sync_channel_UCdOb1Se6eXYpYHD8HWFXtWg;


CREATE JOB IF NOT EXISTS supareel.sync_channel_comments_UCdOb1Se6eXYpYHD8HWFXtWg AS (
) END '2024-01-28 00:00:00' EVERY 10 minute;

DROP DATABASE supareel_db;


DESCRIBE sentiment_classifier_model.model;
DESCRIBE sentiment_classifier_model.features;

SELECT * FROM sentiment_classifier_model
WHERE comment='It is really easy to do NLP with MindsDB';