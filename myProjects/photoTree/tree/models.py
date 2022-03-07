from django.db import models

# Create your models here.

class Node(models.Model):
  
  image = models.IntegerField(null=True, blank=True);
  mother = models.IntegerField(null=True, blank=True);
  spouse = models.IntegerField(null=True, blank=True);
  birthyear = models.IntegerField(null=True, blank=True);

  def __str__(self):
    return str(self.image)