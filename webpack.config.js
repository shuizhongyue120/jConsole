console.log("webpack config init");
var st = new Date().getTime();
var path = require("path");
var webpack = require("webpack");

var BUILD_ROOT_PATH = "build/"; //html输出路径
console.log("\n BUILD_ROOT_PATH:" + BUILD_ROOT_PATH);

var JS_PATH = path.resolve(__dirname, "build/js"); //js输出路径
var CSS_PATH = path.resolve(__dirname, "build/css"); //css输出路径
var HtmlWebpackPlugin = require("html-webpack-plugin"); // Html 插件 文件处理
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //css 插件

//chunkhash  文件的唯一标识 适用于js
//contenthash 适用于css
module.exports = {
    entry: {
        jConsole:"./jConsole.js",
        index: "./index.js" //模块1
    },
    output: {
        path: BUILD_ROOT_PATH, // 图片和 JS, CSS会打包到这里来 这是一个绝对路径
        filename: "js/[name].js?v=[chunkhash:8]", //生成的文件名为
        publicPath: ""
    },
    module: {
        rules: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: "file-loader",
            options: {
                name: "/img/[name].[ext]?[hash:8]"
            }
        }]
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
        new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'), //css输出的路径 相对 BUILD_ROOT_PATH
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html", //html模板；默认生成的可能不符合要求
            // template: 'html-withimg-loader!' + 'index.html'
            chunks: ["index"], //页面引用的js文件列表[com,index,detail]等等(可以直接写文件路径)
            //hash: true //开启后 页面引用的js为:  xxx.js?+20位的hash
        })
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
