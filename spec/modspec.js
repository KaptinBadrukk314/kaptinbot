describe("mod suite", function(){

  const { Sequelize, DataTypes, Op } = require('sequelize');
  const { Client, Intents, MessageActionRow, MessageSelectMenu, Permissions } = require('discord.js');
  const fs = require('fs');

  //test connection
  const db = new Sequelize({
     dialect: 'sqlite',
     storage: 'test.sqlite'
  });

  //create or alter db tables
  const Topic = db.define('Topic', {
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

  const Punishment = db.define('Punishment', {
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

  const User = db.define('User', {
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

  const Vote = db.define('Vote', {
     id:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
     }
  });

  Vote.belongsTo(User);
  Vote.belongsTo(Punishment);

  //sync database
  (async () =>{
     await db.sync();
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
    let punish = {};
    beforeEach(function(){
      punish = jasmine.createSpyObj('punish',['destroy', 'save']);
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
      spyOn(Punishment, 'findOne').and.callFake(()=>{
        return punish;
      });
      const file = require('../commands/mod.js');
      const data = file.execute(interaction, User, Vote, Punishment);
    });
    it("should call getSubcommand", function(){
      expect(interaction.options.getSubcommand).toHaveBeenCalled();
    });
    it("should call findOne", function(){
      expect(Punishment.findOne).toHaveBeenCalled();
    });
    it("should call destroy and save to delete the punishment", function(){
      expect(punish.destroy).toHaveBeenCalled();
      expect(punish.save).toHaveBeenCalled();
    });
  });
});
