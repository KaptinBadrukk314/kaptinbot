describe("mod suite", function(){

  const SequelizeMock = require('sequelize-mock');
  const { Client, Intents, MessageActionRow, MessageSelectMenu, Permissions } = require('discord.js');
  const fs = require('fs');
  let dbMock = new SequelizeMock();

  //test connection
  const dbMock = new Sequelize({
     dialect: 'sqlite',
     storage: 'test.sqlite'
  });

  //create or alter dbMock tables
  var TopicMock = dbMock.define('Topic', {
     id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     },
     name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
     }
  });

  var PunishmentMock = dbMock.define('Punishment', {
     id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     },
     name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
     },
     description: {
        type: DataTypes.STRING,
        allowNull: false
     },
     voteCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
     },
     activeFlg:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        set(value){
          this.setDataValue('activeFlg', value);
        }
     }
  });

  var UserMock = dbMock.define('User', {
     id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     },
     discordUsername:{
        type: DataTypes.STRING,
        allowNull: true
     },
     twitchUsername:{
        type: DataTypes.STRING,
        allowNull: true,
        set(value){
           this.setDataValue('twitchUsername', value);
        }
     }
  });

  var VoteMock = dbMock.define('Vote', {
     id:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     }
  });

  VoteMock.belongsTo(UserMock);
  VoteMock.belongsTo(PunishmentMock);

  //sync database
  (async () =>{
     await dbMock.sync();
  })();

  let SlashCommandBuilder = jasmine.createSpyObj('SlashCommandBuilder',['setName','setDescription','addSubcommand','addStringOption','setRequired','setDefaultPermission'])


  beforeEach(function(){
    const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS] });
    const file = require('../commands/mod.js');

    const data = file.data;
    //console.log(data);
  });
  xdescribe("setup", function(){
    it("should call setName with parameter mod", function(){
      expect(SlashCommandBuilder.setName).toHaveBeenCalledWith('mod');
    });
    it("should call setDescription", function(){
      expect(SlashCommandBuilder.setDescription).toHaveBeenCalled();
    });
    describe("subcommand", function(){
      it("should call addSubcommand", function(){
        expect(SlashCommandBuilder.addSubcommand).toHaveBeenCalled();
      });
      it("should call setName with parameter remove", function(){
        expect(SlashCommandBuilder.setName).toHaveBeenCalledWith('name');
      });
      it("should call setDescription", function(){
        expect(SlashCommandBuilder.setDescription).toHaveBeenCalled();
      });
      describe("addStringOption", function(){
        it("should call addStringOption", function(){
          expect(SlashCommandBuilder.addStringOption).toHaveBeenCalled();
        });
        it("should call setName with parameter", function(){
          expect(SlashCommandBuilder.setName).toHaveBeenCalledWith('name');
        });
        it("should call setDescription",function(){
          expect(SlashCommandBuilder.setDescription).toHaveBeenCalled();
        });
        it("should call setRequired", function(){
          expect(SlashCommandBuilder.setRequired).toHaveBeenCalledWith(true);
        });
      });
    });

    it("should call setDefaultPermission with false", function(){
      expect(SlashCommandBuilder.setDefaultPermission).toHaveBeenCalledWith(false);
    });
  });
  describe("execute", function(){
    let interaction = {};
    beforeEach(async function(){
      interaction = {
        options:{
          getSubcommand: function(){
            return 'remove';
          },
          getString: function(){
            return 'name1';
          }
        },
        reply: function(){
          return;
        }
      };
      spyOn(interaction.options, 'getSubcommand');
      spyOn(interaction.options, 'getString');
      spyOn(interaction, 'reply');

    });
    it("should call getSubcommand", async function(){
      const file = require('../commands/mod.js');
      const data = await file.execute(interaction, User, Vote, Punishment);
      console.log(data);
      expect(interaction.options.getSubcommand).toHaveBeenCalled();
    });
    it("should call findOne", async function(){
      spyOn(Punishment);
      let punish = spyOn(Punishment, 'findOne');
      const file = require('../commands/mod.js');
      const data = await file.execute(interaction, User, Vote, punish);
      console.log(data);
      expect(punish).toHaveBeenCalled();
    });
    it("should call destroy and save to delete the punishment", function(){

    });
  });
});
