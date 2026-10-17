module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      'src/__tests__/**/*.test.js'
    ],

    preprocessors: {
      'src/__tests__/**/*.test.js': ['webpack']
    },

    webpack: {
      mode: 'development',

      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react'
                ],
                plugins: [
                  [
                    'babel-plugin-istanbul',
                    {
                      exclude: [
                        'src/__tests__/**'
                      ]
                    }
                  ]
                ]
              }
            }
          }
        ]
      },

      resolve: {
        extensions: ['.js', '.jsx']
      }
    },

    reporters: [
      'progress',
      'coverage'
    ],

    coverageReporter: {
      dir: 'coverage',

      reporters: [
        {
          type: 'text-summary'
        },
        {
          type: 'html',
          subdir: 'html'
        }
      ]
    },

    browsers: ['ChromeHeadless'],

    singleRun: true
  });
};