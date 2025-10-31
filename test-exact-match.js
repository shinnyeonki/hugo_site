// 정규식 이스케이프
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isExactWordMatch(text, query) {
    // 여러 단어로 구성된 구문인지 확인 (공백 포함)
    if (/\s/.test(query)) {
        // 구문 전체가 텍스트에 정확히 포함되어 있는지 확인
        // 단, 구문의 앞뒤가 단어 경계여야 함
        const escapedQuery = escapeRegex(query);
        // 단어 경계: 문자열 시작, 끝, 또는 공백/특수문자
        const regex = new RegExp(`(^|[\\s\\-_.,;:!?@#$%^&*()[\\]{}<>/"'\`~+=|\\\\])${escapedQuery}($|[\\s\\-_.,;:!?@#$%^&*()[\\]{}<>/"'\`~+=|\\\\])`, 'i');
        console.log('Regex:', regex.toString());
        return regex.test(text);
    }
    
    // 단일 단어: 공백과 특수문자로 분리하여 정확히 일치하는 단어가 있는지 확인
    const words = text.split(/[\s\-_.,;:!?@#$%^&*()[\]{}<>/"'`~+=|\\]+/);
    return words.some(word => word === query);
}

// 테스트
const text = 'inline_code 도 있고, hello world';
const query = 'inline_code 도 있고';

console.log('Text:', text);
console.log('Query:', query);
console.log('Result:', isExactWordMatch(text.toLowerCase(), query.toLowerCase()));

// 추가 테스트
console.log('\n=== 추가 테스트 ===');
console.log('Test 1 - 정확한 구문:', isExactWordMatch('inline_code 도 있고, hello world', 'inline_code 도 있고'));
console.log('Test 2 - 부분 구문:', isExactWordMatch('inline_code 도 있고, hello world', 'code 도 있고'));
console.log('Test 3 - 단일 단어:', isExactWordMatch('inline_code 도 있고, hello world', 'hello'));
console.log('Test 4 - 단일 단어 (언더스코어 포함):', isExactWordMatch('inline_code 도 있고, hello world', 'inline_code'));
