const express = require('express');
const fs = require('fs');
const path = require('path');
const port = 8000;
const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded());
app.use(express.static('assets'));


// importing mongoose file for database using
const db = require('./config/mongoose');

// importing Contact collection which is present in monogodb with schema already set
const Project = require('./models/project');
const Issue = require('./models/issue');



app.get('/', function(req,res){
    Project.find({},function(err,projects){
        if(err){
            console.log('error in fetching  projects');
            return;
        }
        return res.render('home',{
            title: "HomeEJS",
            project_list: projects
        });

    });
})
app.get('/delete-project',function(req,res){
    let id = req.query.id;
    Project.findByIdAndDelete(id,function(err){
        if(err){
            console.log('error in deleting an object from database');
            return
        }
        Issue.find({project: id}, function(err,ps){
            for(var i = 0 ; i < ps.length ; i++){
                Issue.findOneAndDelete({project: id},function(err){
                    if(err){
                        console.log('error in deleting an object from database');
                        return;
                    }
                })
            }
        })
        return res.redirect('/');
    });
});
app.get('/delete-issue',function(req,res){
    let id = req.query.id;
    Issue.findByIdAndDelete(id,function(err){
        if(err){
            console.log('error in deleting an object from database');
            return;
        }
        return res.redirect('back');
    });

});

app.get('/create-project', function(req,res){
    return res.render('create_project');
})
app.post('/created-project', function(req,res){
    Project.create({
        name: req.body.name,
        description: req.body.description,
        author: req.body.author
    }, function(err,newProject){
        if(err){
            console.log('error in creating a project');
            return;
        }
        // console.log('########',newProject);
        return res.redirect(`/project-detail/?id=${newProject._id}`);
    });
})

app.get('/project-detail', function(req,res){
    let id = req.query.id;
    Project.findById(id, function(err,project){
        if(err){
            console.log('error in deleting an object from database');
            return
        }
        Issue.find({project: id}, function(err,issues){
            // console.log(issues);
            return res.render('project_detail',{
                project_info: project,
                issues: issues
            });
        })
        
    })
})
app.post('/project-detail', function(req,res){
    let id = req.query.id;
    Project.findById(id, function(err,project){
        if(err){
            console.log('error in deleting an object from database');
            return;
        }
        if(req.body.title && req.body.filterByAuthor && req.body.filterByLabel){
            Issue.find({$and: [{'project': id }, {'title': req.body.title},{'author': req.body.filterByAuthor},{'label': req.body.filterByLabel}]}, function(err,issues){
                // console.log(issues);
                return res.render('project_detail',{
                    project_info: project,
                    issues: issues
                });
            })
        }else if(req.body.title && req.body.filterByAuthor){
            Issue.find({$and: [{'project': id }, {'title': req.body.title},{'author': req.body.filterByAuthor}]}, function(err,issues){
                // console.log(issues);
                return res.render('project_detail',{
                    project_info: project,
                    issues: issues
                });
            })

        }else if(req.body.filterByAuthor && req.body.filterByLabel){
            Issue.find({$and: [{'project': id },{'author': req.body.filterByAuthor},{'label': req.body.filterByLabel}]}, function(err,issues){
                // console.log(issues);
                return res.render('project_detail',{
                    project_info: project,
                    issues: issues
                });
            })

        }else if(req.body.title && req.body.filterByLabel){
            Issue.find({$and: [{'project': id }, {'title': req.body.title},{'label': req.body.filterByLabel}]}, function(err,issues){
                // console.log(issues);
                return res.render('project_detail',{
                    project_info: project,
                    issues: issues
                });
            })

        }else if(req.body.title || req.body.filterByAuthor || req.body.filterByLabel){
            Issue.find({$and: [{'project': id }, {$or:[{'title': req.body.title},{'author': req.body.filterByAuthor},{'label': req.body.filterByLabel}]}]}, function(err,issues){
                // console.log(issues);
                return res.render('project_detail',{
                    project_info: project,
                    issues: issues
                });
            })
        }else{
            return res.redirect('back');
        }
    })

})

app.get('/create-issue', function(req,res){
    let id = req.query.id;
    Project.findById(id, function(err,project){
        if(err){
            console.log('error in deleting an object from database');
            return
        }
        Issue.find({project: id}, function(err,issues){
            // console.log(issues);
            return res.render('create_issue',{
                project_info: project,
                issues: issues
            });
        })

    })
})
app.post('/created-issue', function(req,res){
    let id = req.query.id;
    console.log(id);

    Issue.create({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        label: req.body.label,
        project: id
    }, function(err, newIssue){
        if(err){
            console.log('error in creating a issue');
            return;
        }
        // console.log('########',newIssue);
        return res.redirect(`/project-detail/?id=${id}`);

    });
})



app.listen(port, function(err){
    if(err){
        console.log("error in running server:", err);
    }
    console.log("express server is running on port:", port);
})