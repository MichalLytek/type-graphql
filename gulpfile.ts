import { Gulpclass, MergedTask, SequenceTask, Task } from "gulpclass";

import * as gulp from "gulp";
import * as del from "del";
import * as shell from "gulp-shell";
import * as replace from "gulp-replace";
import * as ts from "gulp-typescript";
// import tslint from "gulp-tslint";
// const stylish = require("tslint-stylish");
// const sourcemaps = require("gulp-sourcemaps");
// const mocha = require("gulp-mocha");
// const chai = require("chai");
// const istanbul = require("gulp-istanbul");
// const remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");

@Gulpclass()
export class Gulpfile {
  // -------------------------------------------------------------------------
  // General tasks
  // -------------------------------------------------------------------------

  /**
   * Cleans build folder.
   */
  @Task()
  clean(cb: del.Options) {
    return del(["build/**"], cb);
  }

  /**
   * Runs typescript files compilation.
   */
  @Task()
  compile() {
    return gulp.src("*.ts", { read: false }).pipe(shell(["tsc"]));
  }

  // -------------------------------------------------------------------------
  // Packaging and Publishing tasks
  // -------------------------------------------------------------------------

  /**
   * Publishes a package to npm from ./build/package directory.
   */
  @Task()
  npmPublish() {
    return gulp.src("*.js", { read: false }).pipe(shell(["cd ./build/package && npm publish"]));
  }

  /**
   * Copies all sources to the package directory.
   */
  @MergedTask()
  packageCompile() {
    const tsProject = ts.createProject("tsconfig.json");
    const tsResult = gulp
      .src(["./src/**/*.ts"])
      // .pipe(sourcemaps.init())
      .pipe(tsProject());

    return [
      tsResult.dts.pipe(gulp.dest("./build/package")),
      tsResult.js
        // .pipe(sourcemaps.write(".", { sourceRoot: "", includeContent: true }))
        .pipe(gulp.dest("./build/package")),
    ];
  }

  /**
   * Moves all compiled files to the final package directory.
   */
  @Task()
  packageMoveCompiledFiles() {
    return gulp.src("./build/package/src/**/*").pipe(gulp.dest("./build/package"));
  }

  /**
   * Moves all compiled files to the final package directory.
   */
  @Task()
  packageClearCompileDirectory(cb: del.Options) {
    return del(["./build/package/src/**"], cb);
  }

  /**
   * Change the "private" state of the packaged package.json file to public.
   */
  @Task()
  packagePreparePackageFile() {
    return gulp
      .src("./package.json")
      .pipe(replace('"private": true,', '"private": false,'))
      .pipe(gulp.dest("./build/package"));
  }

  /**
   * This task will replace all typescript code blocks in the README
   * (since npm does not support typescript syntax highlighting)
   * and copy this README file into the package folder.
   */
  @Task()
  packageReadmeFile() {
    return gulp
      .src("./README.md")
      .pipe(replace(/```ts([\s\S]*?)```/g, "```js$1```"))
      .pipe(gulp.dest("./build/package"));
  }

  /**
   * Creates a package that can be published to npm.
   */
  @SequenceTask()
  package() {
    return [
      "clean",
      "packageCompile",
      "packageMoveCompiledFiles",
      "packageClearCompileDirectory",
      ["packagePreparePackageFile", "packageReadmeFile"],
    ];
  }

  /**
   * Creates a package and publishes it to npm.
   */
  @SequenceTask()
  publish() {
    return ["package", "npmPublish"];
  }

  // -------------------------------------------------------------------------
  // Run tests tasks
  // -------------------------------------------------------------------------

  /**
   * Runs ts linting to validate source code.
   */
  // @Task()
  // tslint() {
  //   return gulp
  //     .src(["./src/**/*.ts", "./test/**/*.ts", "./sample/**/*.ts"])
  //     .pipe(tslint())
  //     .pipe(
  //       tslint.report(stylish, {
  //         emitError: true,
  //         sort: true,
  //         bell: true,
  //       }),
  //     );
  // }

  /**
   * Runs before test coverage, required step to perform a test coverage.
   */
//   @Task()
//   coveragePre() {
//     return gulp
//       .src(["./build/compiled/src/**/*.js"])
//       .pipe(istanbul())
//       .pipe(istanbul.hookRequire());
//   }

  /**
   * Runs post coverage operations.
   */
//   @Task("coveragePost", ["coveragePre"])
//   coveragePost() {
//     chai.should();
//     // chai.use(require("sinon-chai"));
//     // chai.use(require("chai-as-promised"));

//     return gulp
//       .src(["./build/compiled/test/functional/**/*.js", "./build/compiled/test/issues/**/*.js"])
//       .pipe(mocha())
//       .pipe(istanbul.writeReports());
//   }

//   @Task()
//   coverageRemap() {
//     return gulp
//       .src("./coverage/coverage-final.json")
//       .pipe(remapIstanbul())
//       .pipe(gulp.dest("./coverage"));
//   }

  /**
   * Compiles the code and runs tests.
   */
//   @SequenceTask()
//   tests() {
//     return ["clean", "compile", "coveragePost", "coverageRemap", "tslint"];
//   }
}
