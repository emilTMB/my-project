const gulp = require('gulp') // с помощью require подключаем модуль gulp //подключаем глап
const less = require('gulp-less') // компилируем less в CSS
const del = require('del') // используем для отчистки от лишних файлов. Позволяет удалять файлы
const rename = require('gulp-rename') // позволяет переименовывать компилируемый файл, а так же добавлять к нему теги суффиксы и тд.
const cleanCSS = require('gulp-clean-css') // Используется для удаления лишних пробелов, отступов и т.д ПО СУТИ для минификации css
const babel = require('gulp-babel') // компилирует новый формат js кода в старый для того, чтобы он читался всеми сайтами
const uglify = require('gulp-uglify') // данный плагин служит для минификации js-файлов - он удаляет пробелы, запятые, точки с запятой.
const concat = require('gulp-concat') // данный плагин компилирует несколько js файлов в один
//babel/core мы не подключаем - он нужен для самого babel

const paths = { //объект с путями
    styles: {
        src: 'src/styles/**/*.less',//** - любая вложенность каталогов т.е сколько угодно папок далее, все это будет отслежено *.less - мы не знаем как конкретно называется файл, но знаем что он заканчивается на .less и галп его найдет. Это называется шаблоны галп.
        dest: 'dist/css/' //место куда скомпилируются конечные файлы
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}

function clean() { // функция для отчистки каталога
 return del(['dist'])
}

function styles() {
    return gulp.src(paths.styles.src) // в src мы ищем все файлы/ в скобках передаем путь к изначальному файлу где находятся наши стили его мы берем из нашей константы paths. 
        .pipe(less()) //.pipe - используем для того чтобы выполнять с этим разные действия например скомпилировать less в css
        .pipe(cleanCSS()) //удаляет все лишнее в том числе пробелы и тд. приводит код в максимально оптимизированный вид
        .pipe(rename({ //чтобы в итоге компилированный файл назывался main.min.css
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest)) // dest это каталог в который мы перемещаем скомпилированный файл (расшифровка pipe(действие).dest((путь назначения)собственно наш путь куда мы компилируем файл)) || ЭТА ФУНКЦИЯ ДОЛЖНА ИДТИ В САМОМ КОНЦЕ ИНАЧЕ ВСЕ, ЧТО БУДЕТ ПОСЛЕ НЕЕ НЕ СКОМПИЛИРУЕТСЯ
}
//Задача для обработтки скриптов
function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true //карта
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js')) // при конкатинации (объединении файлов в один) тут же можно задать новое имя для файла в скобках
    .pipe(gulp.dest(paths.scripts.dest)) // то куда все будет записываться
}

function watch() {
    gulp.watch(paths.styles.src, styles) // с помощью  watch мы отслеживаем файлы в каталоге и если любой файл в каталоге будет изменен, то у нас будет что-то выполняться и таск который будет выполняться пишется через запятую после пути
    gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(styles, scripts), watch) // series позволяет выполнять задачи перечисленные через запятую ПОСЛЕДОВАТЕЛЬНО
// const build = gulp.parallel() // series позволяет выполнять задачи перечисленные через запятую ПОСЛЕДОВАТЕЛЬНО

exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch //чтобы завершить эту либо любую другую задачу, мы захдим в терминал и нажимаем ctrl+c
exports.build = build
exports.default = build // default срабатывает когда мы пишем просто команду gulp по этому при команде галп у нас будет срабатывать build