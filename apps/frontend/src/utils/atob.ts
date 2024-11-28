function atob(encodedString: string): string {
    try {
        // 브라우저 native atob 사용
        return decodeURIComponent(escape(window.atob(encodedString)));
    } catch (error) {
        console.error('Base64 디코딩 실패:', error);
        return encodedString; // 실패 시 원본 문자열 반환
    }
}

export default atob;
