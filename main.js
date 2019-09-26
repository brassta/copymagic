(function() {
    const fs = require('fs-extra');
    const path = require('path');
    const ignoreDirectoriesList = ['.idea', 'node_modules', '.git', 'dist', 'e2e'];
    const { COPYFILE_EXCL } = fs.constants;
    const source = 'e:\\projects\\Web2GoProject\\'
    const destination = 'c:\\Users\\Branko Stevanovic\\Desktop\\svn-source\\';

    fs.emptyDirSync(destination);

    const walk = function(dir, target, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if(err) return done(err);
            const targetFolder = path.join(target, dir.replace(source, ''));
            if(!fs.existsSync(targetFolder)){
                fs.mkdir(targetFolder, 0o777, function(err) {
                    if(err){
                        console.error('mkdir err', err);
                    }
                });
            }
            let pending = list.length;
            if(!pending) return done(null, results);
            list.forEach(function(founded) {
                founded = path.resolve(dir, founded);
                fs.stat(founded, function(err, stat) {
                    if(stat && stat.isDirectory()){
                        walk(founded, target, function(err, res) {
                            results = results.concat(res);
                            if(!--pending) done(null, results);
                        });
                    }
                    else {
                        if(Date.now() - stat.mtimeMs < 86400000/2){
                            fs.copy(founded, `${targetFolder}\\${path.basename(founded)}`, function(err) {
                                if(err) return console.error('ene', err);
                                console.log('copied', founded);
                            });
                        }

                        results.push(founded);
                        if(!--pending) done(null, results);
                    }
                });
            });
        });
    };

    const clearIgnoredDirectories = function() {

        for(const entry of ignoreDirectoriesList) {
            const targetDirectory = path.join(destination, entry);
            fs.pathExists(targetDirectory, (err, exists) => {
                if(err) return console.error(err);
                fs.remove(targetDirectory, function(err) {
                    if(err) return console.error(err);
                });
            })

        }
    }

    walk(source, destination, function(err, results) {
        if(err) throw err;
        setTimeout(() => {
            clearIgnoredDirectories()
            console.log('all done!');
        }, 10000);
    });

}());

