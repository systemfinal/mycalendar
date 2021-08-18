#nodeイメージをdockerhubよりpullする、OSはlinux alpine指定
FROM node:14.17-alpine
#コンテナ内のワーキングディレクトリの指定（ルート下のapp）
WORKDIR /app
#vuecliインストール
RUN npm install -g @vue/cli
#shファイルをコンテナにコピー     これ以降が成功していなかった！！のでdockerstart.shの内容をコンテナ内で実行する必要がある
#COPY dockerstart.sh /scripts/start.sh
#shフォルダの権限追加（全員実行可）
#RUN chmod +x /scripts/*
#初期実行
#ENTRYPOINT [ "/scripts/start.sh" ]
