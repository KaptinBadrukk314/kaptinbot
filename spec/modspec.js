describe("mod suite", function(){

  const SequelizeMock = require('sequelize-mock');
  const { Client, Intents, MessageActionRow, MessageSelectMenu, Permissions } = require('discord.js');
  const fs = require('fs');
  let dbMock = new SequelizeMock();

  var PunishmentMock = dbMock.define('Punishment', {
     id: '1293810483',
     name: 'Timeout',
     description: 'Timeout user for 45 seconds',
     voteCount: 0,
     activeFlg: 'false',
     modActivate: 'true'
  });

  var UserMock = dbMock.define('User', {
     id: '982736232',
     discordUsername:'discordUsername11',
     twitchUsername: 'twitchUsername11'
  });

  var VoteMock = dbMock.define('Vote', {
     id:'123456789',
     userId: '982736232',
     punishmentId: '1293810483'
  });

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
