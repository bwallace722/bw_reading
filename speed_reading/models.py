from django.contrib.auth.models import User
from django.db import models

class Passage(models.Model):
    """
    This corresponds to a reading passage that the user may attempt.
    """
    passage_title = models.CharField(default="", max_length=200)
    passage_text = models.TextField()
    words_in_passage = models.IntegerField(default=0, editable=False)

    def __str__(self):
        return self.passage_title

    def save(self, *args, **kwargs):
        """
        This overrides the default save method, so when this is
        created, words_in_passage gets set.
        """
        self.words_in_passage = self.count_words(self.passage_text)
        super(Passage, self, *args).save()

    def count_words(self, passage_string):
        """
        Utility method to count the number of words.
        """
        split = passage_string.split()
        return len(split)


class Attempt(models.Model):
    SECONDS_PER_MINUTE = 60
    MILLISECONDS_PER_SECOND = 1000
    """
    A new Attempt is made each time a user clicks start and then stop
    on a passage.
    """
    passage = models.ForeignKey(Passage)
    user = models.ForeignKey(User)
    # Django 1.7 doesn't support 1.8's DurationField:
    duration_in_milliseconds = models.BigIntegerField()
    time_of_occurrence = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user) + ": " + str(self.words_per_minute) + " wpm"

    @property
    def words_per_minute(self):
        """
        Calculates reading speed of the attempt in words per minute.
        """
        return (self.passage.words_in_passage
                * self.SECONDS_PER_MINUTE 
                * self.MILLISECONDS_PER_SECOND
                / self.duration_in_milliseconds)