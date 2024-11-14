module.exports = {
    apps: [
        {
            name: "my-app",
            script: "./dist/main.js",  // 애플리케이션 시작 파일
            instances: "max",          // 모든 CPU 코어를 사용할 경우 'max'
            exec_mode: "cluster",      // 클러스터 모드로 실행
        },
    ],
};
