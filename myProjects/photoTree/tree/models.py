from django.db import models

# Create your models here.

class Node(models.Model):
  
  image = models.IntegerField(default=None);
  mother = models.IntegerField(default=None);
  spouse = models.IntegerField(default=None);
  birthyear = models.IntegerField(default=None);

  def __str__(self):
    return str(self.image)
