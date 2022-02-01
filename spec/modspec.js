const { SlashCommandBuilder } = require('@discordjs/builders');
const { Sequelize, DataTypes, Op } = require('sequelize');
const { Client, MessageActionRow, MessageSelectMenu, Permissions } = require('discord.js');
const fs = require('fs');

describe("mod suite", function(){
  spyOn(SlashCommandBuilder, "setName");
  spyOn(SlashCommandBuilder, "setDescription");
  spyOn(SlashCommandBuilder, "addSubcommand");
  spyOn(SlashCommandBuilder, "addStringOption");
  spyOn(SlashCommandBuilder, "setRequired");
  spyOn(SlashCommandBuilder, "setDefaultPermission");

  beforeEach(function(){
    const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS] });
    const file = require('../commands/mod.js');
  });
  describe("setup", function(){
    beforeEach(function(){

    });
    it("should call setName with parameter mod", function(){
      expect(SlashCommandBuilder.setName).toHaveBeenCalledWith('mod');
    });
    it("should call setDescription", function(){
      expect(SlashCommandBuilder.setDescription).toHaveBeenCalled();
    });
    describe("subcommand", function(){
      it("should call setSubcommand", function(){
        expect(SlashCommandBuilder.setSubcommand).toHaveBeenCalled();
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
    beforeEach(function(){

    });

  });
});
