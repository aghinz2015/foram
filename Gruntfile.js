// Generated on 2015-04-25 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/assets/scss/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/assets/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/assets',
                connect.static('./app/assets')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code assets are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed assets
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/assets/',
          src: '{,*/}*.css',
          dest: '.tmp/assets/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/assets/',
          src: '{,*/}*.css',
          dest: '.tmp/assets/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      },
      sass: {
        src: ['<%= yeoman.app %>/assets/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/assets/scss',
        cssDir: '.tmp/assets/css',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/assets/images',
        javascriptsDir: '<%= yeoman.app %>/assets/js',
        fontsDir: '<%= yeoman.app %>/assets/fonts',
        importPath: './bower_components/foundation/scss',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/assets/fonts',
        relativeAssets: true,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          imagesDir: '/assets/images',
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/assets/{,*/}*.css',
          '<%= yeoman.dist %>/assets/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/assets/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/assets'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/assets/main.css': [
    //         '.tmp/assets/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // imagemin: {
    //   dist: {
    //     options: {},
    //     files: [{
    //       expand: true,
    //       cwd: '<%= yeoman.app %>/assets/images',
    //       src: '**/*.{png,jpg,jpeg,gif}',
    //       dest: '<%= yeoman.dist %>/assets/images'
    //     }]
    //   }
    // },

    // svgmin: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%= yeoman.app %>/assets/images',
    //       src: '{,*/}*.svg',
    //       dest: '<%= yeoman.dist %>/assets/images'
    //     }]
    //   }
    // },

    htmlmin: {
      dist: {
        options: {
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/assets/images',
          dest: '<%= yeoman.dist %>/assets/images',
          src: ['{,*/}*.{png,jpg,jpeg,gif,webp,svg}']
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/assets/fonts',
          dest: '<%= yeoman.dist %>/fonts',
          src: ['{,*/}*.*']
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/config',
          dest: '<%= yeoman.dist %>/config',
          src: ['{,*/}*.*']
        }]
      },
      assets: {
        expand: true,
        cwd: '<%= yeoman.app %>/assets',
        dest: '.tmp/assets/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // Deployment
    deploy: {
      staging: {
        servers: [{
          host: '46.101.145.100',
          username: 'deploy'
        }]
      },
      production: {
        servers: [{
          host: 'mongo.icsr.agh.edu.pl',
          username: 'viewer'
        }]
      },
      before: ["curl -X POST --data-urlencode \"payload={\\\"channel\\\": \\\"#hooks\\\", \\\"username\\\": \\\"Deployer\\\", \\\"icon_url\\\": \\\"http://gravatar.com/avatar/885e1c523b7975c4003de162d8ee8fee?r=g&s=40\\\", \\\"text\\\": \\\"`echo $USER` has started deploying branch `git symbolic-ref HEAD | sed -e \\\"s,.*/\\(.*\\),\\1,\\\"` of foram to production\\\"}\" https://hooks.slack.com/services/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"],
      after: ["curl -X POST --data-urlencode \"payload={\\\"channel\\\": \\\"#hooks\\\", \\\"username\\\": \\\"Deployer\\\", \\\"icon_url\\\": \\\"http://gravatar.com/avatar/885e1c523b7975c4003de162d8ee8fee?r=g&s=40\\\", \\\"text\\\": \\\"`echo $USER` has finished deploying branch `git symbolic-ref HEAD | sed -e \\\"s,.*/\\(.*\\),\\1,\\\"` of foram to production\\\"}\" https://hooks.slack.com/services/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"],
      deploy_path: '/apps/foram_production',
      source_path: 'dist/'
    },

    // Environments
    ngconstant: {
      options: {
        name: 'config',
        dest: 'app/scripts/config.js'
      },
      development: {
        constants: {
          env: 'development',
          api_host: 'http://localhost:3000/'
        }
      },
      staging: {
        constants: {
          env: 'staging',
          api_host: 'http://46.101.145.100/'
        }
      },
      production: {
        constants: {
          env: 'production',
          api_host: 'http://mongo.icsr.agh.edu.pl/'
        }
      }
    },
  });

  grunt.registerTask('push_code_production', 'Deploy code to the production server', function (target) {
    var servers = grunt.config.get('deploy').production.servers;
    push_code(servers);
  });

  grunt.registerTask('push_code_staging', 'Deploy code to the staging server', function (target) {
    var servers = grunt.config.get('deploy').staging.servers;
    push_code(servers);
  });

  var push_code = function(servers) {
    var config = grunt.config.get('deploy');
    var exec = require('child_process').exec;
    var timeStamp = require('moment')().format('YYYYMMDDHHmmss');
    var basePath = config.deploy_path;
    var deployPath = basePath + '/releases/' + timeStamp;
    var command;

    servers.forEach(function (server) {
      var ssh = function (command) {
        command = 'ssh -t ' + server.username + "@" + server.host + ' "' + command + '"';
        console.log(command);
        return exec(command);
      }

      ssh('mkdir -p ' + deployPath + '; rm ' + basePath + '/current; ln -s ' + deployPath + ' ' + basePath + '/current');
      command = '(cd ' + config.source_path + '; ' + 'scp -rp . ' + server.username + "@" + server.host + ':' + deployPath + ')';
      console.log(command);
      exec(command);
    });

    config.after.forEach(function (hook) {
      exec(hook);
    });
  }

  grunt.registerTask('deploy', 'Compile and deploy code', function (target) {
    var config = grunt.config.get('deploy');
    var exec = require('child_process').exec;

    config.before.forEach(function (hook) {
      exec(hook);
    });

    grunt.task.run(['ngconstant:staging', 'build', 'push_code_staging', 'ngconstant:development']);
  });

  grunt.registerTask('deploy_production', 'Compile and deploy code', function (target) {
    var config = grunt.config.get('deploy');
    var exec = require('child_process').exec;

    config.before.forEach(function (hook) {
      exec(hook);
    });

    grunt.task.run(['ngconstant:production', 'build', 'push_code_production', 'ngconstant:development']);
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'ngconstant:development',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
