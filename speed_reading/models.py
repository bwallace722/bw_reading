from django.contrib.auth.models import User
from django.db import models

class Passage(models.Model):
    """
    This corresponds to a reading passage that the user may attempt.
    """
    passage_title = models.CharField(default="", max_length=200)
    passage_text = models.TextField()

    def __str__(self):
        return self.passage_title

class Attempt(models.Model):
    """
    A new Attempt is made each time a user clicks start and then stop
    on a passage.
    """
    passage = models.ForeignKey(Passage)
    user = models.ForeignKey(User)
    # Django 1.7 doesn't support 1.8's DurationField, but DurationField
    # is implemented in number of microseconds.
    duration_in_microseconds = models.BigIntegerField()
    time_of_occurrence = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user) + ": " + str(self.words_per_minute()) + " wpm"

    def words_per_minute(self):
        """
        Calculates reading speed of the attempt in words per minute.
        """
        # not yet implemented
        return self.duration_in_microseconds