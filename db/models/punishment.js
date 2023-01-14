"use strict";

import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;

let Punishment = null;

function punishmentInit(db) {
	if (Punishment == null){
		Punishment = db.define('Punishment', {
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			voteCount: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			activeFlg:{
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
				set (value){
					this.setDataValue('activeFlg', value);
				},
			},
		});
		return Punishment;
	} else {
		console.log("Punishment Already Initialized");
	}
}

export { Punishment, punishmentInit };
