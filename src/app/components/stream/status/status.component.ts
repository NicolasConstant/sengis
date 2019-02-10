import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Status, Account } from "../../../services/models/mastodon.interfaces";
import { StatusWrapper } from "../stream.component";

@Component({
    selector: "app-status",
    templateUrl: "./status.component.html",
    styleUrls: ["./status.component.scss"]
})
export class StatusComponent implements OnInit {
    displayedStatus: Status;
    reblog: boolean;
    hasAttachments: boolean;
    replyingToStatus: boolean;

    @Output() browseAccountEvent = new EventEmitter<string>();
    @Output() browseHashtagEvent = new EventEmitter<string>();
    @Output() browseThreadEvent = new EventEmitter<string>();

    private _statusWrapper: StatusWrapper;
    status: Status;
    @Input('statusWrapper')
    set statusWrapper(value: StatusWrapper) {
        this._statusWrapper = value;
        this.status = value.status;

        if (this.status.reblog) {
            this.reblog = true;
            this.displayedStatus = this.status.reblog;
        } else {
            this.displayedStatus = this.status;
        }

        if (!this.displayedStatus.account.display_name) {
            this.displayedStatus.account.display_name = this.displayedStatus.account.username;
        }

        if (this.displayedStatus.media_attachments && this.displayedStatus.media_attachments.length > 0) {
            this.hasAttachments = true;
        }
    }
    get statusWrapper(): StatusWrapper {
        return this._statusWrapper;
    }

    constructor() { }

    ngOnInit() {
    }

    openAccount(account: Account): boolean {
        let accountName = account.acct;
        if (!accountName.includes('@'))
            accountName += `@${account.url.replace('https://', '').split('/')[0]}`;

        this.browseAccountEvent.next(accountName);
        return false;
    }

    openReply(): boolean {
        this.replyingToStatus = !this.replyingToStatus;

        return false;
    }

    closeReply(): boolean {
        this.replyingToStatus = false;
        return false;
    }

    accountSelected(accountName: string): void {
        this.browseAccountEvent.next(accountName);
    }

    hashtagSelected(hashtag: string): void {
        this.browseHashtagEvent.next(hashtag);
    }

    textSelected(): void {
        const status = this._statusWrapper.status;

        if (status.reblog) {            
            this.browseThreadEvent.next(status.reblog.uri);
        } else {
            this.browseThreadEvent.next(this._statusWrapper.status.uri);
        }
    }
}