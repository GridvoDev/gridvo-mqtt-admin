#!/bin/bash
kubectl -n gridvo get svc | grep -q gridvo-mqtt-admin
if [ "$?" == "1" ];then
	kubectl create -f gridvo_mqtt_admin-service.yaml --record
	kubectl -n gridvo get svc | grep -q gridvo-mqtt-admin
	if [ "$?" == "0" ];then
		echo "gridvo_mqtt_admin-service install success!"
	else
		echo "gridvo_mqtt_admin-service install fail!"
	fi
else
	echo "gridvo_mqtt_admin-service is exist!"
fi
kubectl -n gridvo get pods | grep -q gridvo-mqtt-admin
if [ "$?" == "1" ];then
	kubectl create -f gridvo_mqtt_admin-deployment.yaml --record
	kubectl -n gridvo get pods | grep -q gridvo-mqtt-admin
	if [ "$?" == "0" ];then
		echo "gridvo_mqtt_admin-deployment install success!"
	else
		echo "gridvo_mqtt_admin-deployment install fail!"
	fi
else
	kubectl delete -f gridvo_mqtt_admin-deployment.yaml
	kubectl -n gridvo get pods | grep -q gridvo-mqtt-admin
	while [ "$?" == "0" ]
	do
	kubectl -n gridvo get pods | grep -q gridvo-mqtt-admin
	done
	kubectl create -f gridvo_mqtt_admin-deployment.yaml --record
	kubectl -n gridvo get pods | grep -q gridvo-mqtt-admin
	if [ "$?" == "0" ];then
		echo "gridvo_mqtt_admin-deployment update success!"
	else
		echo "gridvo_mqtt_admin-deployment update fail!"
	fi
fi
