from django.contrib.auth.models import User
from django.test import TestCase

from models import Attempt, Passage

class PassageModelTests(TestCase):

    def setUp(self):
        Passage.objects.create(passage_title="hi", passage_text="hi")
        Passage.objects.create(
            passage_title="hi hello", passage_text="hi hello")
        Passage.objects.create(
            passage_title="3", passage_text=
                "test            two __three__&& \n four")

    def test_one_word_count(self):
        hi = Passage.objects.get(passage_title="hi")
        self.assertEqual(hi.words_in_passage, 1)

    def test_two_word_count(self):
        hi_hello = Passage.objects.get(passage_title="hi hello")
        self.assertEqual(hi_hello.words_in_passage, 2)

    def test_tabs_and_newline(self):
        three = Passage.objects.get(passage_title="3")
        self.assertEqual(three.words_in_passage, 4)


class WordsPerMinuteTests(TestCase):

    def setUp(self):

        p = Passage.objects.create(passage_title="1", passage_text="one two three")
        u = User.objects.create()
        Attempt.objects.create(passage=p, user=u,
                               duration_in_milliseconds=60000)
        Attempt.objects.create(passage=p, user=u,
                               duration_in_milliseconds=30000)

    def test_one_minute(self):
        a = Attempt.objects.get(duration_in_milliseconds=60000)
        self.assertEqual(a.words_per_minute, 3)

    def test_half_minute(self):
        a = Attempt.objects.get(duration_in_milliseconds=30000)
        self.assertEqual(a.words_per_minute, 6)