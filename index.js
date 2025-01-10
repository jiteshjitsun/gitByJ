(() => {
    class Commit {
      /**
       * Commit class
       * A single commit.
       *
       * @param {number} id       ID of commit.
       * @param {string} message  Commit message.
       */
      constructor(id, message, parent) {
        this.id = id;
        this.message = message;
        this.parent = parent;
      }
    }

    class Branch {
      /**
       * Branch class
       * Represents a branch.
       *
       * @param {string} name Branch name.
       * @param {Commit} commit Commit object.
       */
      constructor(name, commit) {
        this.name = name;
        this.commit = commit;
      }
    }
  
    class Git {
      /**
       * Git class
       * Represents a Git repository.
       *
       * @param {string} name Repository name.
       */
      constructor(name) {
        this.name = name;
        this.lastCommitId = -1;
        this.commits = []; // add array to store commits
        this.history = []; // add array to store history
        this.branches = []; // add array to store branches
        let master = new Branch("master", null);
        this.branches.push(master);
        this.HEAD = master; // add HEAD pointer - it will be updated every time we make a commit
      }
  
      /**
       * Make a commit.
       * @param  {string} message Commit message.
       * @return {Commit}        Created commit object.
       */
      commit(message) {
        const commit = new Commit(++this.lastCommitId, this.HEAD.commit, message);
        this.HEAD.commit = commit; // update HEAD pointer
        this.commits.push(commit);
        this.history.push(commit); // add commit to history
        return commit;
      }

      /**
       * Get commit log.
       * @return {Array} Commit log.
       */
      log() {
        let commit = this.HEAD.commit;
        this.history = []; // clear history
        while (commit) {
          this.history.push(commit);
          commit = commit.parent;
        }   
        return this.history;
      }

      getHistory() {
        return this.history;
      }

      getCommit(id) {
        return this.history.find(commit => commit.id === id);
      }

      checkout(branchName) {
        for(let i = 0; i < this.branches.length; i++) {
          if(this.branches[i].name === branchName) {
            // found the branch
            console.log("switching to branch " + branchName);;
            this.HEAD = this.branches[i];
            return this.HEAD;
          }
        }
        // if branch not exist, create new branch
        let branch = new Branch(branchName, this.HEAD.commit);
        this.branches.push(branch);
        this.HEAD = branch;
        console.log("Switched to new branch " + branchName);
        return branch;
      }

      historyToIdMapper(history) {
        let ids = history.map((commit) => {
            return commit.id;
        });
        return ids.join('-');
      }
    }
  
    const repo = new Git('my-repo');
    // repo.commit('first commit')
    console.log(repo.commit('second commit'));
    console.log(repo.commit('third commit'));
    let log = repo.log();
    
    // console.assert(historyToIdMapper(repo.log()) === "1-0");
    console.assert(log.length === 2);
    console.assert(repo.HEAD.name === "master"); // Should be on master branch.
    repo.checkout("testing");
    console.assert(repo.HEAD.name === "testing"); // Should be on new testing branch.
    repo.checkout("master");
    console.assert(repo.HEAD.name === "master"); // Should be on master branch.
    repo.checkout("testing");
    console.log(repo.getHistory());
    globalThis.Git = Git;
  })();