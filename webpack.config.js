var pkg = require('./package.json');
var st = new Date().getTime();
var path = require("path");
var webpack = require("webpack");

var BUILD_ROOT_PATH = "build/"; //html输出路径
console.log("\n BUILD_ROOT_PATH:" + BUILD_ROOT_PATH);


//chunkhash  文件的唯一标识 适用于js
//contenthash 适用于css
module.exports = {
    entry: {
        jConsole: "./jConsole.js",
        jConsoleMobile: "./jConsole-mobile.js",
    },
    output: {
        path: BUILD_ROOT_PATH, // 图片和 JS, CSS会打包到这里来 这是一个绝对路径
        filename: "[name].min.js?v=[chunkhash:8]", //生成的文件名为
        publicPath: "",
        library: 'jConsole',
        libraryTarget: 'umd',
       // umdNameDefine: true
    },
    module: {
        rules: []
    },
    resolve: {},
    /*    devServer: {
            historyApiFallback: true,
            noInfo: true
        },
        performance: {
            hints: false
        },*/
    //devtool: '#eval-source-map',
    plugins: [
        new webpack.BannerPlugin([
            pkg.name + ' v' + pkg.version + ' (' + pkg.homepage + ')',
            'Copyright ' + new Date().getFullYear() + ', ' + pkg.author,
            pkg.license + ' license'
        ].join('\n'))
    ]
}
if ("development" === process.env.NODE_ENV || "test" === process.env.NODE_ENV) {
    //module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"development"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: false
        })
    ]);
} else if ("production" === process.env.NODE_ENV) {
    //module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                drop_debugger: true,
                dead_code: true,
                unused: true,
                drop_console: true //remove all console
            },
            output: {
                comments: false, // remove all comments
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}


console.log("\n 编译耗时：" + (new Date().getTime() - st) / 1000 + " s");
