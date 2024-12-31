# CI/CD Demo

## Action的自动化部署示例

### 1. 代码提交触发 GitHub Action
每当开发者向 main 分支提交代码时，自动触发 GitHub Action 工作流。

### 2. 构建 Docker 镜像
使用项目中的 Dockerfile 文件将最新的代码打包成 Docker 镜像，确保应用能够在一致的环境中运行。

### 3. 推送镜像至阿里云私有仓库
构建完成后，系统会自动将生成的 Docker 镜像推送到阿里云的私有容器镜像仓库中，以便后续部署使用。

### 4. 阿里云服务器拉取并部署最新镜像
远程阿里云服务器会自动拉取最新的 Docker 镜像，并将其部署为正在运行的应用服务。



## Automation Deployment Workflow Demo

### 1. Code Commit Triggers GitHub Action
Whenever developers push code to the main branch, it automatically triggers a GitHub Action workflow.

### 2. Build Docker Image
The latest code is packaged into a Docker image using the project's Dockerfile, ensuring the application runs in a consistent environment.

### 3. Push Image to Alibaba Cloud Private Registry
After successful build, the system automatically pushes the generated Docker image to Alibaba Cloud’s private container registry for subsequent deployment use.

### 4. Alibaba Cloud Server Pulls and Deploys Latest Image
The remote Alibaba Cloud server automatically pulls the latest Docker image and deploys it as the running application service.


