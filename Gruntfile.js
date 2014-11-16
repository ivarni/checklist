module.exports = function(grunt) {

    grunt.initConfig({

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                }
            },
            dist: {
                files: {
                    'dist/app.js': ['src/js/app.js']
                }
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        cwd: 'src/',
                        expand: true,
                        src: 'index.html',
                        dest: 'dist/'
                    },
                    {
                        cwd: 'src/css/',
                        expand: true,
                        src: '**',
                        dest: 'dist/'
                    }
                ]
            }
        },

        watch: {
            src: {
                files: ['src/**/*'],
                tasks: ['browserify', 'copy']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['browserify', 'copy']);

}
