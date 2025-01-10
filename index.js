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
        this.HEAD = null; // add HEAD pointer - it will be updated every time we make a commit
      }
  
      /**
       * Make a commit.
       * @param  {string} message Commit message.
       * @return {Commit}        Created commit object.
       */
      commit(message) {
        const commit = new Commit(++this.lastCommitId, this.HEAD, message);
        this.HEAD = commit; // update HEAD pointer
        this.commits.push(commit);
        this.history.push(commit); // add commit to history
        return commit;
      }

      /**
       * Get commit log.
       * @return {Array} Commit log.
       */
      log() {
        let commit = this.HEAD;
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
    }
  
    const repo = new Git('my-repo');
    // repo.commit('first commit')
    console.log(repo.commit('second commit'));
    console.log(repo.commit('third commit'));
    let log = repo.log();
    console.assert(log.length === 2);
    // console.assert(!!log[0] && log[0].id === 1);
    // console.assert(!!log[1] && log[1].id === 0);
    console.log(repo.getHistory());
    globalThis.Git = Git;
  })();
  