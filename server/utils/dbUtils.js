module.exports = {
    enableWALMode: (db) => {
      db.run('PRAGMA journal_mode=WAL');
      db.run('PRAGMA synchronous=NORMAL');
      db.run('PRAGMA busy_timeout=5000');
    },
    
    withTransaction: async (db, callback) => {
      await db.run('BEGIN TRANSACTION');
      try {
        const result = await callback();
        await db.run('COMMIT');
        return result;
      } catch (err) {
        await db.run('ROLLBACK');
        throw err;
      }
    }
  };