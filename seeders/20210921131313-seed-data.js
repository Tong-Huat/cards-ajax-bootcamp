const jsSHA = require('jssha');

const { SALT } = 'i love cocomelon';

// eslint-disable-next-line import/prefer-default-export
const getHash = (input) => {
  // eslint-disable-next-line new-cap
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  // const unhasedString = `${input}`;
  const unhasedString = `${input}-${SALT}`;
  shaObj.update(unhasedString);

  return shaObj.getHash('HEX');
};
const userPassword = '123456';
const hashedPassword = getHash(userPassword);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = [
      {
        email: 'Alina@gmail.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'Adam@gmail.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert('users', userData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
