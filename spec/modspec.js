describe("mod test suite", function(){

  const proxyquire = require('proxyquire');
  const { Client, Intents, MessageActionRow, MessageSelectMenu, Permissions } = require('discord.js');
  const fs = require('fs');
  const { makeMockModels } = require('sequelize-test-helpers');

  const data= {
     id: '1293810483',
     name: 'Timeout',
     description: 'Timeout user for 45 seconds',
     voteCount: 0,
     activeFlg: 'false',
     modActivate: 'true'
  };


  // var UserMock = dbMock.define('user', {
  //    id: '982736232',
  //    discordUsername:'discordUsername11',
  //    twitchUsername: 'twitchUsername11'
  // });
  //
  // var VoteMock = dbMock.define('vote', {
  //    id:'123456789',
  //    userId: '982736232',
  //    punishmentId: '1293810483'
  // });

  //const punishment = proxyquire('../commands/mod', {'../models/punishment': PunishmentMock});

  //var SlashCommandBuilder = jasmine.createSpyObj('SlashCommandBuilder',['setName','setDescription','addSubcommand','addStringOption','setRequired','setDefaultPermission'])
  //const slashCommandBuilder = proxyquire('../commands/mod', {'SlashCommandBuilder': SlashCommandBuilder});

  beforeEach(function(){
    const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS] });
    const file = require('../commands/mod.js');

    const data = file.data;

    //console.log(data);
  });
  xdescribe("setup", function(){
    let subCommand = 'remove';
    let stringOption = 'name';
    let stringValue = 0;
    const interaction = {
      options:{
        getSubcommand: function(){
          return subCommand;
        },
        getString: function(){
          return 'Timeout'
        }
      },
      reply: function(){
        return;
      },
      userstate:{
        username: 'user'
      }
    };
    it("should call setName with parameter mod", async function(){
      let execute = await file.execute(interaction, dbMock);
      expect(SlashCommandBuilder.setName).toHaveBeenCalledWith('mod');
    });
    it("should call setDescription", async function(){
      let execute = await file.execute(interaction, dbMock);
      expect(SlashCommandBuilder.setDescription).toHaveBeenCalled();
    });
    describe("subcommand", function(){
      it("should call addSubcommand", async function(){
        let execute = await file.execute(interaction, dbMock);
        expect(SlashCommandBuilder.addSubcommand).toHaveBeenCalled();
      });
      it("should call setName with parameter remove", async function(){
        let execute = await file.execute(interaction, dbMock);
        expect(SlashCommandBuilder.setName).toHaveBeenCalledWith('name');
      });
      it("should call setDescription", async function(){
        let execute = await file.execute(interaction, dbMock);
        expect(SlashCommandBuilder.setDescription).toHaveBeenCalled();
      });
      describe("addStringOption", function(){
        it("should call addStringOption", async function(){
          let execute = await file.execute(interaction, dbMock);
          expect(SlashCommandBuilder.addStringOption).toHaveBeenCalled();
        });
        it("should call setName with parameter", async function(){
          let execute = await file.execute(interaction, dbMock);
          expect(SlashCommandBuilder.setName).toHaveBeenCalledWith('name');
        });
        it("should call setDescription", async function(){
          let execute = await file.execute(interaction, dbMock);
          expect(SlashCommandBuilder.setDescription).toHaveBeenCalled();
        });
        it("should call setRequired", async function(){
          let execute = await file.execute(interaction, dbMock);
          expect(SlashCommandBuilder.setRequired).toHaveBeenCalledWith(true);
        });
      });
    });

    it("should call setDefaultPermission with false", async function(){
      let execute = await file.execute(interaction, dbMock);
      expect(SlashCommandBuilder.setDefaultPermission).toHaveBeenCalledWith(false);
    });
  });
  describe("execute", function(){
    const file = require('../commands/mod.js');
    let data = {};
    let subCommand = 'remove';
    let stringOption = 'name';
    let stringValue = 0;
    const interaction = {
      options:{
        getSubcommand: function(){
          return subCommand;
        },
        getString: function(){
          return 'Timeout'
        }
      },
      reply: function(){
        return;
      },
      userstate:{
        username: 'user'
      }
    };

    afterEach(function(){
      data = {};
    });
    it("should call getSubcommand", async function(){
      spyOn(interaction.options, 'getSubcommand').and.callThrough();
      data = await file.execute(interaction, dbMock);

      expect(interaction.options.getSubcommand).toHaveBeenCalled();
      expect(interaction.options.getSubcommand()).toEqual(subCommand);
    });
    it("should call getString", async function(){
      spyOn(interaction.options, 'getString').and.callThrough();
      data = await file.execute(interaction, dbMock);

      expect(interaction.options.getString).toHaveBeenCalledWith(stringOption);
    });
    fit("should call findOne", async function(){
      var punish = spyOn(Punishment, 'findOne').and.callFake(async ()=>{
        return await PunishmentMock.findOne({
          where: {
            name: 'Timeout'
          }
        });
      });
      data = await file.execute(interaction, dbMock);


      expect(punish).toHaveBeenCalled();
      expect(punish).toHaveBeenCalledWith({
        where: {
          name: 'Timeout'
        }
      });
    });
    it("should call destroy and save to delete the punishment", async function(){
      spyOn(interaction, 'reply');
      spyOn(Punishment, 'destroy').and.callThrough();
      spyOn(Punishment, 'save').and.callThrough();
      data = await file.execute(interaction, dbMock);

      expect(interaction.reply).toHaveBeenCalled();
    });
  });
});
