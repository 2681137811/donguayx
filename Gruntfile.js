
module.exports = function(grunt) {
    grunt.initConfig({

    // 读取包信息
        pkg: grunt.file.readJSON('package.json'), 

    // 一、JS 文件压缩混淆
        uglify : {
           build: {
                options: {
                    mangle : true,             // 混淆变量名
                    preserveComments : false,  // 'all':不删除注释   false:删除全部注释   some:保留@preserve @license @cc_on等注释
                    compress : true,           // 压缩
                    //beautify : true,           // 美化
                },
                files: [{
                    expand : true,
                    cwd    : 'build/js',
                    src    : ['*.js','**/*.js'],
                    dest   : 'public/static/js',
                    ext    : '.min.js'
                }]
          }
        },

    // 三、CSS 文件编译、压缩、语法检查
        less : {
            build: {
                options: {
                    compress: true
                },
                files: [{
                    expand  : true,                    
                    cwd     : 'build/less',
                    src     : '*.less',
                    dest    : 'public/static/css',
                    ext     : '.css'
                }]
            }
        },
        cssmin : {
            options: {},
            build: {
                expand: true,
                cwd: 'build/css',
                src: ['*.css'],
                dest: 'public/static/css',
                ext: '.css'
            }
        },




    // 自动运行 --------------------------
        watch : {
            less : {
                files : 'build/less/**',
                tasks : ['less'],
                options : { spawn:false }
            },
            cssmin : {
                files : 'build/css/**',
                tasks : ['cssmin'],
                options : { spawn:false }
            },
            uglify : {
                files : 'build/js/**',
                tasks : ['uglify'],
                options : { spawn:false }
            },           
        }
    });


    // 二、语法检查


// 加载插件    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

// 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify','less','cssmin','watch']);  // 控制台输入 grunt 时执行的任务
};