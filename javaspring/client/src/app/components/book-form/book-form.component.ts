import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit {
  form: FormGroup;
  bookId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1000)]]
    });
  }

  ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.bookId) {
      this.bookService.getBook(this.bookId).subscribe(book => this.form.patchValue(book));
    }
  }

  onSubmit() {
    const book = this.form.value;

    if (this.bookId) {
      book.id = this.bookId;
      this.bookService.updateBook(book).subscribe(() => this.router.navigate(['/']));
    } else {
      this.bookService.addBook(book).subscribe(() => this.router.navigate(['/']));
    }
  }
}
