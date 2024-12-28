# 使用官方的 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 将当前目录下的所有文件复制到容器内的 /usr/share/nginx/html 目录
COPY . /usr/share/nginx/html

# 暴露80端口，以便访问Web服务器
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]