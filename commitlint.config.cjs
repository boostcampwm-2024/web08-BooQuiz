module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-case': [2, 'always', 'lower-case'],
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'design',
                '!breaking change',
                '!hotfix',
                'style',
                'refactor',
                'comment',
                'docs',
                'test',
                'chore',
                'rename',
                'remove',
            ],
        ],
        'subject-empty': [2, 'never'],
        'subject-case': [0, 'never'], // 대소문자 제한 해제
        'subject-full-stop': [2, 'never', '.'],
        'body-leading-blank': [2, 'always'],
        'footer-leading-blank': [2, 'always'],
    },
    parserPreset: {
        parserOpts: {
            issuePrefixes: ['EPIC: #', 'Story: #', 'Task: #'],
        },
    },
};
