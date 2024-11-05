// module.exports = {
//     extends: ['@commitlint/config-conventional'],
//     rules: {
//       'type-case': [2, 'always', 'lower-case'],
//       'type-enum': [
//         2,
//         'always',
//         [
//           'feat',
//           'fix',
//           'design',
//           '!breaking change',
//           '!hotfix',
//           'style',
//           'refactor',
//           'comment',
//           'docs',
//           'test',
//           'chore',
//           'rename',
//           'remove'
//         ]
//       ],
//       'subject-empty': [2, 'never'],
//       'subject-full-stop': [2, 'never', '.'],
//       'body-leading-blank': [2, 'always'],
//       'footer-leading-blank': [2, 'always'],
//     },
//     parserPreset: {
//       parserOpts: {
//         issuePrefixes: ['EPIC: #', 'Story: #', 'Task: #']
//       }
//     }
// };

// module.exports = {
//     parserPreset: {
//       parserOpts: {
//         headerPattern: /^(feat|fix|design|!breaking change|!hotfix|style|refactor|comment|docs|test|chore|rename|remove)(\.[a-zA-Z\d-]+)*: (.+)$/,
//         headerCorrespondence: ['type', 'scope', 'subject']
//       }
//     },
//     plugins: [
//       {
//         rules: {
//           'header-match-pattern': (parsed) => {
//             const { type, subject } = parsed;
//             if (!type) {
//               return [false, 'header must include valid type'];
//             }
//             if (!subject) {
//               return [false, 'header must include subject'];
//             }
//             return [true, ''];
//           },
//           'epic-story-task-format': (parsed, _when, _value) => {
//             const { body, footer } = parsed;
//             const epicPattern = /EPIC: #\d+/;
//             const storyPattern = /Story: #\d+/;
//             const taskPattern = /Task: #\d+/;
//             const footerText = footer || '';
//             if (!footerText.match(epicPattern) ||
//                 !footerText.match(storyPattern) ||
//                 !footerText.match(taskPattern)) {
//               return [false, 'footer must include EPIC, Story, and Task references'];
//             }
//             return [true, ''];
//           }
//         }
//       }
//     ],
//     rules: {
//       'header-match-pattern': [2, 'always'],
//       'epic-story-task-format': [2, 'always']
//     }
//   };

module.exports = { extends: ["@commitlint/config-conventional"] };