from django.db import models

class UserData(models.Model):
	number = models.IntegerField()
	quantity = models.CharField(max_length=30)

	def __str__(self):
		return 'Number: ' + str(self.number) + ', Quantity: ' + self.quantity

def getUserData():
	return UserData.objects.all()

def addUserData(count):
	newData = UserData(number = UserData.objects.all().count() + 1, quantity = str(count))
	newData.save()

def resetUserData():
	lines = UserData.objects.all()

	for line in lines:
		line.delete()
