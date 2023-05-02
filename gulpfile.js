const gulp = require('gulp') // с помощью require подключаем модуль gulp //подключаем глап
const less = require('gulp-less') // компилируем less в CSS
const del = require('del') // используем для отчистки от лишних файлов. Позволяет удалять файлы
const stylus = require('gulp-stylus') // Препроцессор css
const rename = require('gulp-rename') // позволяет переименовывать компилируемый файл, а так же добавлять к нему теги суффиксы и тд.
const cleanCSS = require('gulp-clean-css') // Используется для удаления лишних пробелов, отступов и т.д ПО СУТИ для минификации css
const babel = require('gulp-babel') // компилирует новый формат js кода в старый для того, чтобы он читался всеми сайтами
const uglify = require('gulp-uglify') // данный плагин служит для минификации js-файлов - он удаляет пробелы, запятые, точки с запятой.
const concat = require('gulp-concat') // данный плагин компилирует несколько js файлов в один
//babel/core мы не подключаем - он нужен для самого babel
const sourcemaps = require('gulp-sourcemaps') // данный плагин позволяет создавать так называемые карты благодаря которым мы в браузере будем видеть строки в наших файлах style.less
const autoprefixer = require('gulp-autoprefixer') // для того чтобы css работал со всеми в том числе и устаревшими браузерами
const imagemin = require('gulp-imagemin') // компрессия изображений (СЖАТИЕ ИЗОБРАЖЕНИЙ)
const htmlmin = require('gulp-htmlmin'); // сжатие html  в html min
const size = require('gulp-size'); // позволяет определить размер файлов при компиляции
const newer = require('gulp-newer'); // для того чтобы не перекомпилировать файлы, которые не изменялись.
const browsersync = require('browser-sync').create(); // для автообновления в реальносм времени в браузере
const gulppug = require('gulp-pug'); //HTML препроцессор минифицируется в файл second.html НЕ ВПИСАН В ГЛАВНЫЙ ТАСК КОТОРЫЙ ВСЕ ВЫЗЫВАЕТ ЕГО МОЖНО ВПИСАТЬ ВМЕСТО html в таске build
const sass = require('gulp-sass')(require('sass'));// Препроцессор Sass CSS и scss
const ts = require('gulp-typescript'); // плагин для тайпскрипт
coffee = require('gulp-coffee'); // кофе скрипт


const paths = { //объект с путями
    pug: {
        src: 'src/*.pug',
        dest: 'dist/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    styles: {
        src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.less'],//** - любая вложенность каталогов т.е сколько угодно папок далее, все это будет отслежено *.less - мы не знаем как конкретно называется файл, но знаем что он заканчивается на .less и галп его найдет. Это называется шаблоны галп. И поскольку мы указали корректный путь для  less и stylus пути у нас будут определяться автоматически при ссылке на src для актуального на данный момент плагина/препроцессора Для препроцессора stylus поменять путь на 'src/styles/**/*.styl', Для SASS 'src/styles/**/*.sass', Для SCSS 'src/styles/**/*.scss', 
        dest: 'dist/css/' //место куда скомпилируются конечные файлы для LESS 'src/styles/**/*.less'
    },
    scripts: {
        src: ['src/scripts/**/*.coffee' ,'src/scripts/**/*.ts', 'src/scripts/**/*.js'], // , 'src/scripts/**/*.js' - путь для компиляции js // 'src/scripts/**/*.ts' - путь для компиляции тайпскрипт 
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img/'
    }
}

function clean() { // функция для отчистки каталога
 return del(['dist/*','!dist/img']) // отчистить весь дист кроме img
}

function pug() { //  html препроцессор минифицируется в файл second.html НЕ ВПИСАН В ГЛАВНЫЙ ТАСК КОТОРЫЙ ВСЕ ВЫЗЫВАЕТ ЕГО МОЖНО ВПИСАТЬ ВМЕСТО html 
    return gulp.src(paths.pug.src)
    .pipe(gulppug())
    .pipe(size({
        showFiles:true
    })) // позволяет отследить размер скомпилированных файлов
    .pipe(gulp.dest(paths.pug.dest)) //путь для создания файлов туда будет компилироваться файл
    .pipe(browsersync.stream()); // вставляется строго после создания результирующего файла и служит для автообновления браузера
  }

  function html() { // минификация html
    return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size({
        showFiles:true
    })) // позволяет отследить размер скомпилированных файлов
    .pipe(gulp.dest(paths.html.dest)) //путь для создания файлов туда будет компилироваться файл
    .pipe(browsersync.stream()); // вставляется строго после создания результирующего файла и служит для автообновления браузера
  }

function styles() {
    return gulp.src(paths.styles.src) // в src мы ищем все файлы/ в скобках передаем путь к изначальному файлу где находятся наши стили его мы берем из нашей константы paths. 
        .pipe(sourcemaps.init()) // чтобы инициализировать (создать) карту sourcemaps
        .pipe(less()) //.pipe - используем для того чтобы выполнять с этим разные действия например скомпилировать less в css
        // .pipe(stylus()) // препроцессор CSS Если мы работаем с stylus мы комментируем less
        .pipe(sass().on('error', sass.logError)) // Sass Препроцессор CSS и scss
        .pipe(autoprefixer({ // вызывается после срабатывания less
			cascade: false
		}))
        .pipe(cleanCSS({level:2})) //удаляет все лишнее в том числе пробелы и тд. приводит код в максимально оптимизированный вид // level 2 это второй уровень оптимизации, его можно менять, но этого как правило достаточно
        .pipe(rename({ //чтобы в итоге компилированный файл назывался main.min.css
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))// чтобы отследить и записать созданную ранее нашу карту sourcemaps // '.' для того чтобы записать sourcemaps в отдельный файл .map
        .pipe(size({
            showFiles:true
        })) // позволяет отследить размер скомпилированных файлов
        .pipe(gulp.dest(paths.styles.dest)) // dest это каталог в который мы перемещаем скомпилированный файл (расшифровка pipe(действие).dest((путь назначения)собственно наш путь куда мы компилируем файл)) || ЭТА ФУНКЦИЯ ДОЛЖНА ИДТИ В САМОМ КОНЦЕ ИНАЧЕ ВСЕ, ЧТО БУДЕТ ПОСЛЕ НЕЕ НЕ СКОМПИЛИРУЕТСЯ
        .pipe(browsersync.stream()); // вставляется строго после создания результирующего файла и служит для автообновления браузера
}
//Задача для обработтки скриптов
function scripts() {
    return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init()) // чтобы инициализировать (создать) карту sourcemaps
    .pipe(coffee({bare: true})) // для того чтобы писать на coffee scrypt для этого комментим TS type scrypt
    // .pipe(ts({
    //     noImplicitAny: true,
    //     outFile: 'main.min.js'
    // })) // плагин для тайпскрипта
    .pipe(babel({
        presets: ['@babel/env'] // для того чтобы плагин  делал js код под старые версии браузера
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js')) // при конкатинации (объединении файлов в один) тут же можно задать новое имя для файла в скобках
    .pipe(sourcemaps.write('.')) // чтобы отследить и записать созданную ранее нашу карту sourcemaps // '.' для того чтобы записать sourcemaps в отдельный файл .map
    .pipe(size({
        showFiles:true
    })) // позволяет отследить размер скомпилированных файлов
    .pipe(gulp.dest(paths.scripts.dest)) // то куда все будет записываться
    .pipe(browsersync.stream()); // вставляется строго после создания результирующего файла и служит для автообновления браузера
}

function img() { // компрессия изображений (СЖАТИЕ ИЗОБРАЖЕНИЙ)
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest)) // чтобы не перекомпилировать файлы (в данном случае изображения), которые не изменялись по данному пути.
        .pipe(imagemin({
            progressive: true,
            optimozationLevel: 5
        }))
        .pipe(size({
            showFiles:true
        })) // позволяет отследить размер скомпилированных файлов
        .pipe(gulp.dest(paths.images.dest))
}

function watch() {
    browsersync.init({ // инициализация сервера для автообновления страницы в реальносм времени, мы меняет - меняется и результат
        server: {
            baseDir: "./dist/"
        }
    })
    gulp.watch(paths.html.dest).on('change', browsersync.reload)// отслеживает изменения в html дест, и тут же обновляет страницу как только они произошли
    gulp.watch(paths.html.src, html) // отслеживаем изменение src после чего запускает задачу html 
    gulp.watch(paths.styles.src, styles) // с помощью  watch мы отслеживаем файлы в каталоге и если любой файл в каталоге будет изменен, то у нас будет что-то выполняться и таск который будет выполняться пишется через запятую после пути
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, img) // отслеживаем изменение изображений и если они были изменены вызываем функцию img
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch) // series позволяет выполнять задачи перечисленные через запятую ПОСЛЕДОВАТЕЛЬНО
// const build = gulp.parallel() // series позволяет выполнять задачи перечисленные через запятую ПОСЛЕДОВАТЕЛЬНО

exports.clean = clean
exports.img = img
exports.html = html
exports.pug = pug
exports.styles = styles
exports.scripts = scripts
exports.watch = watch //чтобы завершить эту либо любую другую задачу, мы захдим в терминал и нажимаем ctrl+c
exports.build = build
exports.default = build // default срабатывает когда мы пишем просто команду gulp по этому при команде галп у нас будет срабатывать build