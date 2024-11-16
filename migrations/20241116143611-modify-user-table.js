// Initial migration to create the User table
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      address: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      services: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  },
};

// Migration to modify the User table
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'services', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.changeColumn('Users', 'amount', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'services', {
      type: Sequelize.JSONB,
      allowNull: false,
    });

    await queryInterface.changeColumn('Users', 'amount', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  },
};

// Command to create a new migration file
// Run the following command in your terminal to create a new migration file:
// npx sequelize-cli migration:generate --name modify-user-table
