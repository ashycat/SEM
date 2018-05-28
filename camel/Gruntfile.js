'use strict';
module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Show grunt task time
    require('time-grunt')(grunt);

    // Configurable paths for the app
    var appConfig = {
        app: 'public',
        dist: 'dist',
    };

    // Grunt configuration
    grunt.initConfig({

        // Project settings
        camel: appConfig,

        concat : {
          options: {
            banner : '/* <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            separator : '\n\n/*********************************************************************************************/\n\n',
            stripBanners: {
              block : true,
              line : false
            }
          },
          basic : {
            src : ['public/js/**/*.js'],
            dest : 'public/dist/js/all.js'
          }
        },
        uglify: {
          options: {
              mangle: false
          },
          build : {
            files: [{
              expand : true,
              cwd : 'public/js',
              src : '**/*.js',
              dest : 'public/dist/js'
            }]
          }
        },
        jshint:{
          options:{
            reporter: require('jshint-stylish'),
            curly: true,
            eqeqeq: true,
            eqnull: true,
            browser: true,
            globals : {
              "app_config" : false,
              "define" : false,
              /* MOCHA */
              "describe"   : false,
              "it"         : false,
              "before"     : false,
              "beforeEach" : false,
              "after"      : false,
              "afterEach"  : false
            }
          },
          all: ['app-init.js', 'public/js/**/*.js',],
        },
        cssmin:{
          minify:{
              expand: true,
              cwd: 'public/styles/',
              src: ['*.css', '!*.min.css'],
              dest: 'public/dist/css',
              ext: '.min.css'
          },
          options:{
              keepSpecialComments: 0
          }
        },
        // The grunt server settings
        connect: {
            options: {
                port: 9000,
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
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= camel.dist %>'
                }
            }
        },
        // Compile less to css
        less: {
            development: {
                options: {
                    compress: true,
                    optimization: 2
                },
                files: {
                    "public/styles/style.css": "app/less/style.less"
                }
            }
        },
        // Watch for changes in live edit
        watch: {
            styles: {
                files: ['public/less/**/*.less'],
                tasks: ['less', 'copy:styles'],
                options: {
                    nospawn: true,
                    livereload: '<%= connect.options.livereload %>'
                },
            },
            js: {
                files: ['<%= camel.app %>/scripts/{,*/}*.js'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= camel.app %>/**/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= camel.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        // Clean dist folder
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= camel.dist %>/{,*/}*',
                        '!<%= camel.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= camel.app %>',
                        dest: '<%= camel.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            '/public/views/{,*/}*.html',
                            '/public/styles/img/*.*',
                            '/public/images/{,*/}*.*'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/fontawesome',
                        src: ['fonts/*.*'],
                        dest: '<%= camel.dist %>'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/bootstrap',
                        src: ['fonts/*.*'],
                        dest: '<%= camel.dist %>'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'app/fonts/pe-icon-7-stroke/',
                        src: ['fonts/*.*'],
                        dest: '<%= camel.dist %>'
                    },
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= camel.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= camel.dist %>/scripts/{,*/}*.js',
                    '<%= camel.dist %>/styles/{,*/}*.css',
                    '<%= camel.dist %>/styles/fonts/*'
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= camel.dist %>',
                    src: ['*.html', '/public/views/{,*/}*.html'],
                    dest: '<%= camel.dist %>'
                }]
            }
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist'
            }
        },
        usemin: {
            html: ['dist/index.html']
        },
        mochacli: {
          options: {
              reporter: 'nyan',
              bail: true
          },
          all: ['test/api/*.js', 'test/services/*.js']
        },
        apidoc : {
          camel : {
            src : 'controllers/api',
            dest: '../apidoc'
          }
        }

    });

    grunt.registerTask('live', [
        'clean:server',
        'copy:styles',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('server', [
        'build',
        'connect:dist:keepalive'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'less',
        'useminPrepare',
        'concat',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);
    
    grunt.registerTask('default', 
        ['concat',
         'uglify', 
         'jshint', 
         'cssmin'
         ]);
    
    grunt.registerTask('test', ['mochacli']);

    grunt.registerTask('doc', ['apidoc']);
};
